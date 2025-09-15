-- Add comprehensive data visualization and dashboard questions to cover all assignment points

INSERT INTO interview_questions (question, category, difficulty, expected_answer_points) VALUES 
-- Chart Type Selection (Point 1)
('What factors should you consider when choosing between different chart types? Walk me through your decision process for categorical data vs. time series data vs. numerical data.', 'Data Visualization', 'intermediate', ARRAY[
  'Categorical data suits bar charts, column charts, pie charts',
  'Time series data best with line charts, area charts',
  'Numerical data works with histograms, scatter plots, box plots',
  'Consider audience technical level',
  'Purpose: comparison, trends, distribution, correlation, composition',
  'Number of variables affects chart complexity'
]),

-- Dashboard Creation Process (Point 2)
('Describe the complete 7-step process for creating an effective dashboard from planning to deployment. What are the key considerations for each step?', 'Dashboard Design', 'advanced', ARRAY[
  'Define purpose and identify KPIs',
  'Collect and prepare clean data',
  'Choose appropriate visualizations for each metric',
  'Select proper dashboard framework or tool',
  'Design logical layout with hierarchy',
  'Add interactive elements like filters and drill-downs',
  'Test with users and iterate for improvements'
]),

-- Chart Type Applications
('For each scenario, recommend the best chart type and explain why: (1) Comparing quarterly sales across 5 regions, (2) Showing website traffic trends over 12 months, (3) Displaying the distribution of customer ages, (4) Analyzing correlation between price and sales volume.', 'Chart Selection', 'intermediate', ARRAY[
  'Quarterly sales comparison: Bar or column chart for clear category comparison',
  'Website traffic trends: Line chart for time series data',
  'Customer age distribution: Histogram for continuous data distribution',
  'Price vs sales correlation: Scatter plot for relationship analysis',
  'Justification for each choice based on data type and purpose'
]),

-- Dashboard Layout and UX
('What are the best practices for dashboard layout and user experience? How would you organize different types of visualizations for maximum impact?', 'Dashboard UX', 'advanced', ARRAY[
  'Top-left placement for summary metrics and KPIs',
  'Middle section for main charts and trends',
  'Bottom for detailed or supporting information',
  'Logical flow and visual hierarchy',
  'Minimal clutter and clean design',
  'Consistent color schemes and branding',
  'Mobile responsiveness considerations'
]),

-- Interactive Elements
('How would you implement interactive features in a dashboard? What types of interactivity enhance user experience without overwhelming them?', 'Dashboard Interactivity', 'advanced', ARRAY[
  'Filters for date ranges and categories',
  'Tooltips for detailed information on hover',
  'Drill-down capabilities for deeper analysis',
  'Cross-filtering between related charts',
  'Export and sharing functionalities',
  'Progressive disclosure to avoid information overload',
  'Clear visual feedback for user actions'
]),

-- Data Preparation for Visualization
('What data preparation steps are essential before creating visualizations? How do you handle missing values, outliers, and data quality issues?', 'Data Preparation', 'intermediate', ARRAY[
  'Data cleaning and validation processes',
  'Handling missing values through imputation or exclusion',
  'Outlier detection and treatment strategies',
  'Data type conversion and formatting',
  'Aggregation and summarization techniques',
  'Creating calculated fields and derived metrics',
  'Ensuring data consistency and accuracy'
]),

-- Advanced Visualization Techniques
('Explain when and how to use advanced visualization techniques like heat maps, tree maps, and bubble charts. What insights do they provide that simple charts cannot?', 'Advanced Visualization', 'advanced', ARRAY[
  'Heat maps for correlation matrices and pattern detection',
  'Tree maps for hierarchical data and proportions',
  'Bubble charts for three-dimensional relationships',
  'Advantages over simple charts for complex data',
  'Use cases and interpretation guidelines',
  'Performance considerations for large datasets'
]),

-- Dashboard Performance and Optimization
('How do you optimize dashboard performance when dealing with large datasets? What techniques ensure smooth user experience?', 'Performance Optimization', 'advanced', ARRAY[
  'Data aggregation and pre-calculation strategies',
  'Lazy loading and progressive rendering',
  'Caching mechanisms for frequently accessed data',
  'Query optimization and indexing',
  'Pagination and data virtualization',
  'Memory management and resource optimization',
  'Real-time vs. batch processing trade-offs'
]);