# Project: Dashboard Pagination and Filtering Enhancement

## Background and Motivation

The user wants to improve the dashboard's performance, especially for B2B clients who may have a large number of submitted apps (e.g., 100+). Currently, the dashboard fetches all of a user's apps at once, which can lead to slow load times and a poor user experience.

To address this, we will implement a "load more" pagination system. This will initially load a smaller subset of apps (15) and allow the user to load more as they scroll or click a button.

Additionally, a date filtering feature is required. When a user selects a date range, the dashboard should display all apps within that range, temporarily bypassing the pagination.

A key requirement is that the dashboard statistics (total apps, active apps, completed apps) should always reflect the user's complete app portfolio, not just the currently visible paginated set.

## Key Challenges and Analysis

1.  **State Management**: We need to manage the list of displayed apps, the pagination cursor (the last document from the previous fetch), loading states (initial load, loading more), and whether there are more apps to load.
2.  **Firestore Queries**: The current `useUserApps` hook uses a real-time `onSnapshot` listener which is not ideal for a "load more" pagination pattern. We will need to switch to `getDocs` for fetching paginated data.
3.  **Data Fetching Logic**: We'll need new functions in `lib/firestore.ts` to handle:
    *   Fetching a paginated list of apps.
    *   Fetching all apps within a specific date range.
    *   Fetching all apps for accurate statistics without bogging down the UI.
4.  **UI/UX**: The UI needs to be updated to include a "Load More" button and potentially date filter inputs. The user experience should be smooth, with clear loading indicators.
5.  **Handling Mixed Data Views**: The component will need to seamlessly switch between the paginated view and the date-filtered view, fetching data accordingly.

## High-level Task Breakdown

The implementation will be broken down into the following distinct steps. We will proceed one step at a time, ensuring each is working correctly before moving to the next.

### Phase 1: Backend and State Management

1.  **Update Firestore fetching logic**:
    *   **Task**: Create a new function in `lib/firestore.ts` called `getPaginatedUserApps` that accepts a `userId`, a `limit`, and an optional `startAfter` cursor to fetch a single page of apps. This function will use `getDocs`.
    *   **Success Criteria**: The function can be called and returns a limited set of apps and the last document of the set to be used as a cursor for the next page.
2.  **Create a new React Hook for Pagination**:
    *   **Task**: Create a new hook `usePaginatedUserApps` that encapsulates the pagination logic. This hook will manage the state of `apps`, `loading`, `hasMore` (to know when to show "Load More"), and will expose a `loadMore` function.
    *   **Success Criteria**: The hook can be used in a component to fetch the first page of apps, and the `loadMore` function successfully fetches and appends the next page of apps.
3.  **Update Statistics Calculation**:
    *   **Task**: In `app/dashboard/page.tsx`, we will continue to use the existing `useUserApps` hook *only* for calculating the statistics shown in the `DashboardStats` component. This ensures the stats are always based on the full dataset. The paginated hook will be used for the app list.
    *   **Success Criteria**: The stat cards on the dashboard display the correct total counts, even when the app list is paginated.

### Phase 2: UI Implementation

1.  **Integrate Pagination into Dashboard**:
    *   **Task**: Replace the existing `useUserApps` hook (for the app list) in `app/dashboard/page.tsx` with the new `usePaginatedUserApps` hook.
    *   **Success Criteria**: The dashboard initially loads and displays only the first 15 apps.
2.  **Add "Load More" Functionality**:
    *   **Task**: Add a "Load More" button to the UI. This button will call the `loadMore` function from the `usePaginatedUserApps` hook. The button should be disabled when a load is in progress or when `hasMore` is false.
    *   **Success Criteria**: Clicking the "Load More" button fetches the next set of apps and appends them to the list. The button is correctly hidden or disabled when there are no more apps to load.

### Phase 3: Date Filtering

1.  **Add Date Filter UI**:
    *   **Task**: Add date range picker components to the dashboard UI to allow users to select a start and end date.
    *   **Success Criteria**: The date picker components are visible and users can select a date range.
2.  **Implement Date-based Fetching**:
    *   **Task**: Create a new function `getUserAppsByDateRange` in `lib/firestore.ts` that fetches all apps for a user within a given date range.
    *   **Success Criteria**: The function returns all apps created between the specified start and end dates.
3.  **Integrate Date Filtering Logic**:
    *   **Task**: In the dashboard component, add logic to call `getUserAppsByDateRange` when a date range is selected. The component should then display the results from this query instead of the paginated list. The "Load More" button should be hidden when a date filter is active.
    *   **Success Criteria**: When a user selects a date range, the list updates to show all apps within that range. When the filter is cleared, the list reverts to the initial paginated view.

## Project Status Board

- [x] **Phase 1: Backend and State Management**
    - [x] Update Firestore fetching logic (`getPaginatedUserApps`).
    - [x] Create a new React Hook for Pagination (`usePaginatedUserApps`).
    - [x] Ensure statistics calculation remains accurate.
- [x] **Phase 2: UI Implementation**
    - [x] Integrate pagination hook into the dashboard page.
    - [x] Add and wire up the "Load More" button.
- [x] **Phase 3: Date Filtering**
    - [x] Add date filter UI components.
    - [x] Implement date-based fetching function (`getUserAppsByDateRange`).
    - [x] Integrate date filtering logic into the dashboard component.

## Executor's Feedback or Assistance Requests

*This section will be updated by the Executor during implementation.*

## Lessons

*This section will document any learnings or solutions to issues encountered during the project.*
