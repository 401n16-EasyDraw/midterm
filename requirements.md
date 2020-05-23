# Software Requirements

## Vision

The purpose of this application is to provide a few JavaScript files that can be integrated into an existing full stack web application. The current aim specifically is to support a nonprofit organization that lets writings from depositions to be transmitted to a reporter looking at another browser in real time.

## Scope (In/Out)

### IN

The web app will allow one user to write to a document on a webpage in real time.
Another user to will be able to view the previous user's writing and mouse scrolls in real time.
The viewer will also be able to download the document as a pdf file.
The writer will be able to switch between different pages, clear writing, and delete pages. 

### OUT - What will your product not do.

Our website will never turn into an IOS or Android app.
Our website will not provide a database for a true full stack implementation because our goal is integrate code into an existing implementation, not provide a new one to be used.

### Minimum Viable Product

Minimum functionality will be to allow drawing to be transmitted from one browser to another in real time

### Stretch Goals

- creation of multiple pages
- typing text 
- drawing different programmed shapes (circle, square, etc.)
- send the document to Azure/AWS

## Functional Requirements

One user can read onto a webpage with mouse clicks.
Same user can open multiple pages, clear current page, and add new pages.
Another user can view the first user's writing in real time on a different page.
Same user can download the writing onto a PDF file.

### Data Flow

When the writer writes to the deposition page, the `draw.js` file emits a socket.io event to `hub.js`, which then emits an event to `redraw.js`. On page reload, `redraw.js` requests the current data from `draw.js`.

### Non-functional requirements are requirements that are not directly related to the functionality of the application but still important to the app.

A lot of the non-functional requirements do not exist in this project because the code is meant to be integrated into an existing app. We only include .html files as a proof of concept and not the security/authentication and additional usability features that one might like in a more fleshed-out application.
