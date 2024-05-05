# Uevent api

### Event module

GET http://localhost:3001/api/event - Get all events

GET http://localhost:3001/api/event/:eventId - Get event by id

GET http://localhost:3001/api/event/search/filters - ???

GET http://localhost:3001/api/event/topic/getAll - Get all topics?

GET http://localhost:3001/api/event/topic/info/:eventId - Get all topics for event

GET http://localhost:3001/api/event/comments/:eventId - Get all comments including answers under event

GET http://localhost:3001/api/event/preview/:eventId - Return preview of event

GET http://localhost:3001/api/event/likes/:eventId - Return likes for event

PATCH http://localhost:3001/api/event/update/preview/:eventId - Update event preview (key should be "preview")
