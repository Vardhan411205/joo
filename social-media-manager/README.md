# Social Media Campaign Manager

A comprehensive tool for planning, creating, and scheduling social media campaigns using ChatGPT and analytics.

## Features

### Campaign Management
- Create and manage social media campaigns
- Set campaign goals, target audience, and budget
- Track campaign performance and status
- Multi-platform support (Facebook, Twitter, Instagram)

### Post Scheduling
- Schedule posts for multiple social media platforms
- AI-powered content generation using ChatGPT
- Edit and manage scheduled posts
- Post status tracking and notifications

### Analytics Dashboard
- Real-time campaign performance tracking
- Engagement rate analysis
- Reach and impressions tracking
- Post performance metrics
- Visual charts and graphs

### AI Integration
- Generate engaging social media posts
- Content sentiment analysis
- Post improvement suggestions
- Platform-specific recommendations

## Tech Stack

### Frontend
- React.js
- Material-UI
- Recharts for analytics visualization
- Context API for state management
- React Router for navigation

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- OpenAI API integration

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/social-media-manager.git
cd social-media-manager
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create `.env` files:

Backend `.env`:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
PORT=5000
```

Frontend `.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
social-media-manager/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Analytics/
│       │   ├── Campaigns/
│       │   ├── CreatePost/
│       │   ├── Dashboard/
│       │   ├── Layout/
│       │   └── SchedulePosts/
│       ├── contexts/
│       ├── hooks/
│       └── App.js
└── README.md
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login

### Campaigns
- GET `/api/campaigns` - Get all campaigns
- POST `/api/campaigns` - Create new campaign
- PUT `/api/campaigns/:id` - Update campaign
- DELETE `/api/campaigns/:id` - Delete campaign

### Posts
- GET `/api/campaigns/:id/posts` - Get campaign posts
- POST `/api/campaigns/:id/posts` - Create new post
- PUT `/api/campaigns/:id/posts/:postId` - Update post
- DELETE `/api/campaigns/:id/posts/:postId` - Delete post

### Analytics
- GET `/api/campaigns/:id/analytics` - Get campaign analytics
- GET `/api/campaigns/:id/posts/:postId/analytics` - Get post analytics

### AI Integration
- POST `/api/ai/generate-post` - Generate post content
- POST `/api/ai/analyze` - Analyze post content
- POST `/api/ai/improve` - Get content improvements

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 