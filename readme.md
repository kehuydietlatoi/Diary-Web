# Diary Web App
An Application where you can write your diary.

# Used Tech/framework 
- typescript
- nodejs
- ReactJS
- typeorm
- express
- ReactJS
- styled-components

#Installation and Setup backend

Open terminal in current folder (where docker-compose.yml is)

Install npm packages 
- `docker-compose run backend npm install` 

Start containers

- `docker-compose up` / `docker-compose up -d`

Sync database schema

- `docker-compose exec backend npm run typeorm schema:sync`

(Optional) Run test suites

- `docker-compose exec backend npm run test`

# Documentation for the assignment's solution

- CRUD System: Multiple Endpoints for Diary Entries, Labels. You can create, update, delete,
display Diary Entry and Label.
- A Diary (or Diary Entry) has text, which describes an experience or a day (Markdown is supported). The 
other Attributes are id, name, date, labels, created and updated time.
- Each Label has unique name and id.
- Relationship: Diary Entry - ManyToMany - Label.
- Add and delete one or more labels to a diary entry by edit diary entry, endpoint
is : `PATCH /api/diary/:diaryId`.
- Not recommend : There is also other alternative way to add or delete "one" 
label in a diary entry,
by using this endpoint: `POST or DELETE /api/label/:labelId/diary/:diaryId`
- Get all diary entries of one Label `GET /api/label/:labelId/diary/`
- Export CSV data, endpoint is : `GET /api/diary/csv/`

# Extern API
[API-MetaWeather](https://www.metaweather.com/api/)  
When a specific Diary Entry is selected, detailed view in another page will be showed.
Date information of this entry will be sent to API, then diary entry will show 
extra information about the weather (the day when diary entry has been written) 
: state of weather and weather icon.
Endpoint: `GET /api/weather/:year/:month/:day`

# Test

There are 2 opportunities of testing : automatic tests suites with jest and postman.
For automatic testing, run following command in terminal: 
`docker-compose exec backend npm run test`.
For Postman, there is a folder called postman.

# Route Structure

Backend of Application has endpoints as follows:

Get weather state and icon from extern api:
- `GET /api/weather/:year/:month/:day`

### Diary entry router

Get all diary entries:
- `GET /api/diary/`
- Request structure: `{}`

Export all diary entries as csv data:
- `GET /api/diary/csv/`
- Request structure: `{}`

Create new diary entry:
- `POST /api/diary/`
- Request structure: `{"name": "new diary","text": "text of diary entry come here",
"date": "2021-11-20","labels": [{"name": "name of label 1"},
{"name": "test label2"}]}`
- Another request structure with default Date and no label:
  `{"name": "new diary","text": "text of diary entry come here"}`

Delete a diary entry with given id:
- `DELETE /api/diary/:diaryId`
- Request structure: `{}`

Get a diary entry with given id:
- `GET /api/diary/:diaryId`
- Request structure: `{}`

Get all labels of a diary entry with given id:
- `GET /api/diary/:diaryId/label/`
- Request structure: `{}`

Update/edit a diary entry with given id:
- `PATCH /api/diary/:diaryId/`
- Request Structure: `{"name": "new diary","text": "text of diary entry come here",
  "date": "2021-11-20","labels": [{"name": "name of label 1"},
  {"name": "test label2"}]}`
- Another request structure with default Date and no label:
  `{"name": "new diary","text": "text of diary entry come here"}`

### Label router
 
Get all labels:
- `GET /api/label/`
- Request structure: `{}`

Create new label:
- `POST /api/label/`
- Request structure: `{"name": "new label"}`

Delete a label by id:
- `DELETE /api/label/:labelId/`
- Request structure: `{}`

Get a label by id:
- `GET /api/label/:labelId/`
- Request structure: `{}`

Update a label by given id:
- `PATCH /api/label/:labelId/`
- Request structure: `{"name": "new label"}`

### Diary entry - Label router

Add an existing label (by id) to diary entry (by id):
- `POST /api/label/:labelId/diary/:diaryId`
- Request structure: `{}`

Get all diary entries of a label:
- `GET /api/label/:labelId/diary/`
- Request structure: `{}`

Delete an existing label (by id) from a diary entry (by id):
- `DELETE /api/label/:labelId/diary/:diaryId`
- Request structure: `{}`



