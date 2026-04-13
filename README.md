# Gender Classify API

A Node.js REST API that takes a name and returns a gender prediction with confidence scoring, powered by the [Genderize.io](https://genderize.io) API.

---

## Live API

> **Base URL:** `https://YOUR-RENDER-URL.onrender.com`

---

## Endpoint

### `GET /api/classify`

**Query Parameter:**

| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| `name`    | string | Yes      | The name to classify |

---

## Example Requests

**Successful request:**
```
GET /api/classify?name=James
```

**Successful response:**
```json
{
  "status": "success",
  "data": {
    "name": "James",
    "gender": "male",
    "probability": 0.99,
    "sample_size": 1234,
    "is_confident": true,
    "processed_at": "2026-04-13T10:00:00.000Z"
  }
}
```

---

## Error Responses

**Missing name (400):**
```
GET /api/classify
```
```json
{ "status": "error", "message": "Missing required query parameter: name" }
```

**Invalid type (422):**
```
GET /api/classify?name[]=test
```
```json
{ "status": "error", "message": "Invalid type for parameter: name must be a string" }
```

**No prediction available:**
```json
{ "status": "error", "message": "No prediction available for the provided name" }
```

---

## Confidence Logic

`is_confident` is `true` only when **both** conditions are met:
- `probability >= 0.7`
- `sample_size >= 100`

---

## Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) v16 or higher
- npm (comes with Node.js)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/gender-classify-api.git
   cd gender-classify-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Test it**
   ```
   http://localhost:3000/api/classify?name=Emma
   ```

---

## Deploying to Render (Free Hosting)

1. Push this repo to GitHub (must be **public**)
2. Go to [render.com](https://render.com) and sign up for free
3. Click **New → Web Service**
4. Connect your GitHub repo
5. Set these values:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
6. Click **Deploy**
7. Copy the live URL Render gives you — that's your public API base URL

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **HTTP Client:** Axios
- **External API:** [Genderize.io](https://genderize.io)
