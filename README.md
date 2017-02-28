# LEM2 Implementation
An implementation of the LEM2 algorithm was written in JavaScript as a proof of concept.
Implementation includes functionality to induce rules on data sets with set-valued attributes.
A web interface for the application is available at https://lrdodge.github.io/lem2/.

## Technology

* Bootstrap 3
* jQuery
* Mocha.js
* Chai.js
* PapaParse.js
* GitHub Pages

## Data Source
Data sets are input into the application using the Comma Separated Value (CSV) format.
Any data processing errors will be displayed below the data input field and must be resolved before proceeding.
The first row of the data source should be the column labels and the last column should be the decision.
Omit case numbers and separate set values with the `|` character.
For example, the set {1, 2, 3} would be represented as `1|2|3`.
For optimum performance and rule coverage, data should be discretized prior to processing.

A data source must be selected or input to initialize the LEM2 module.
Select a data source by clicking one of the data source option buttons and then clicking the \emph{Load Data} button.
Example data sets are provided to quickly show the capabilities and functionality of the application.
Data source options include:

* Input File - Local CSV file with headers.
* Manual Input - Enter CSV data directly into the data field.
* Examples - Pre-loaded the data filed with one of several existing data sets.

## Concept Selection
After initial data processing (concept and attribute-value block determination), a dialog will display with the concepts derived from the input data.
Each concept will show the value and number of cases within the concept.
Clicking on the number badge will display the cases below.
Clicking the badge again will hide the cases.

Select a concept by clicking one of the concept option buttons in the dialog.
A concept must be selected before rules can be induced.
Once a concept has been selected, click the \emph{Induce Rules} button.
Depending on the size of the data set and number of attribute-value blocks, rule induction may take a significant amount of time.
Size and complexity of the data set will be constrained by the memory available to the browser (rare for discretized data sets).

## Rules Display
Rules will be displayed in the Rules section at the bottom of the page once rule induction is complete.
Rules are shown in the order in which they were created.
Because consistent data is not enforced, it is possible for the goal to not be equal to the empty set and no blocks are available for selection.
This is an indicator the input data set is inconsistent.
An exclamation sign will be displayed by any rules which were unable to be completed.
In these instances it is recommended an approximation of the data set should be created instead. 
