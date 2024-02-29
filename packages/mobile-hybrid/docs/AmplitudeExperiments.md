# Amplitude - Feature Flags and Experiments
Amplitude provides the ability to manage feature flags and experiments via the [BLC dashboard](https://app.eu.amplitude.com/analytics/bluelightcard/home).

## Adding a new Feature Flag or Experiment
1. Create your new flag via [Amplitude](https://app.eu.amplitude.com/analytics/bluelightcard/home)
2. Navigate to 'Experiment' -> 'Flags'
3. Create a flag ensuring you set the relevant deployments (e.g. android-experiment and ios-experiment) as well as Allocation (e.g. 100%)
4. Add your feature flag key (e.g. serch-results-page-categories-links) to `/src/components/AmplitudeProvider/amplitudeKeys.ts`

## Wrapping code in a Feature Flag or Experiment
1. Add the `<Amplitude>` component around the piece of code you want to flag on or off passing the name of the key and the value. The example below shows 'browse categories' being rendered when the flag is on:
    ```tsx
    <Amplitude keyName={FeatureFlags.SEARCH_RESULTS_PAGE_CATEGORIES_LINKS} value="on">
        <BrowseCategories categories={browseCategories} onCategoryClick={onCategoryClick} />
    </Amplitude>
    ```
## Testing Feature flags
1. To allow for unit testing of feature flags simply wrap your component with the JotaiTestProvider and inject the desired flag values in your render, e.g.
   ```tsx
   <JotaiTestProvider initialValues={[[experimentsAndFeatureFlags, featureFlags]]}>
      <SearchResultsPage />
   </JotaiTestProvider>
   ```
## Rolling Feature flags out to Production
1. Open up [Amplitude](https://app.eu.amplitude.com/analytics/bluelightcard/home)
2. Find your flag or experiment in the 'Blue Light Card - Development' project
3. Choose 'Copy across projects' and select 'Blue Light Card - Production'
4. Ensure the deployments and allocations are set as you want

## Implementation Details
The `AmplitudeProvider.tsx` component orchestrates the interation with the Native API for experiments as well as the state management for Flags and Experiments (via Jotai atoms).

This provider is then added at the root of the app (`_app.tsx`) to allow all child components access to the configured flags (set in 'amplitudeKeys.ts'). The `Amplitude.tsx` component then provides components access to this state in Jotai.

The interaction with the Native API occurs in the `InvokeNativeExperiment` class in `experiment.ts`. This delegates to `facade.ts` which calls the relevant injected shimmed functions via the webkit message handlers and listeners.
