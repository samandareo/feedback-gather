# Customer Feedback System

A modern, full-stack customer feedback collection and analysis platform built with **FastAPI**, **Next.js**, and **GraphQL**. This system allows users to create custom surveys, share them via unique links, collect responses, and analyze results with powerful analytics.

## 🚀 Features

### Core Functionality
- **Survey Creation**: Design custom surveys with multiple-choice and open-ended questions
- **Survey Sharing**: Generate unique shareable links for each survey
- **Response Collection**: Collect feedback from customers through shared survey links
- **Real-time Analytics**: Visualize survey results with interactive charts and graphs
- **Data Export**: Export survey responses to CSV format for further analysis

### User Management
- **Authentication**: Secure user registration and login system
- **Dashboard**: Personalized dashboard to manage all surveys
- **Survey Management**: Create, edit, delete, and toggle survey status

### Technical Features
- **GraphQL API**: Efficient data querying and manipulation
- **REST API**: Traditional REST endpoints for compatibility
- **Real-time Updates**: Live data synchronization across the application
- **Responsive Design**: Modern, mobile-friendly user interface
- **Modern UI/UX**: Beautiful animations and smooth interactions using Framer Motion

## 🏗️ Architecture

### Backend (FastAPI + GraphQL)
- **Framework**: FastAPI with Strawberry GraphQL
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **API**: Dual REST and GraphQL endpoints
- **CORS**: Configured for cross-origin requests

### Frontend (Next.js + TypeScript)
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS for modern, responsive design
- **State Management**: React Query for server state management
- **Animations**: Framer Motion for smooth UI interactions
- **Charts**: Chart.js with react-chartjs-2 for data visualization

### Database Schema
- **Users**: User accounts with email and password
- **Surveys**: Survey metadata with titles, descriptions, and share tokens
- **Questions**: Survey questions with multiple-choice options
- **Responses**: Individual survey responses
- **Answers**: Detailed answer data for each response

## 📦 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize database**:
   ```bash
   python init_db.py
   ```

5. **Run the backend server**:
   ```bash
   python main.py
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL=sqlite:///./feedback_system.db
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### API Configuration

Update the API URL in `frontend/src/config.ts` if needed:

```typescript
export const API_URL = 'http://localhost:8000';
```

## 📚 API Documentation

### REST Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/survey/` - Create new survey
- `GET /api/survey/{id}` - Get survey details
- `POST /api/survey/{id}/share` - Generate share link
- `GET /api/survey/shared/{token}` - Get shared survey
- `POST /api/responses/{survey_id}` - Submit survey responses
- `GET /api/responses/{survey_id}` - Get survey responses
- `GET /api/survey/{id}/analytics` - Get survey analytics
- `GET /api/survey/{id}/export` - Export responses to CSV

### GraphQL Endpoints

- `POST /graphql` - GraphQL endpoint
- GraphQL Playground available at `/graphql` when running in development

## 🎯 Usage

### Creating a Survey

1. **Sign up/Login** to your account
2. **Click "Create Survey"** on the dashboard
3. **Add survey details**: title, description
4. **Add questions**: Choose between multiple-choice or open-ended
5. **Save the survey**

### Sharing a Survey

1. **Navigate to your survey** in the dashboard
2. **Click the share button** to generate a unique link
3. **Copy the link** and share it with your customers
4. **Customers can access** the survey using the shared link

### Analyzing Results

1. **View responses** in the dashboard
2. **Access analytics** for detailed insights
3. **Export data** to CSV for external analysis
4. **Toggle survey status** to stop/start collecting responses

## 🚀 Deployment

### Backend Deployment (Vercel)

The backend includes `vercel.json` configuration for easy deployment to Vercel:

```bash
vercel --prod
```

### Frontend Deployment (Vercel)

Deploy the frontend to Vercel:

```bash
cd frontend
vercel --prod
```

## 🧪 Testing

Run backend tests:

```bash
cd backend
pytest
```

Run frontend tests:

```bash
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/customer-feedback-system/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Roadmap

- [ ] Real-time notifications for new responses
- [ ] Advanced analytics with machine learning insights
- [ ] Survey templates and themes
- [ ] Multi-language support
- [ ] Integration with popular CRM platforms
- [ ] Mobile app development
- [ ] Advanced user roles and permissions
- [ ] Survey scheduling and automation

---

**Built with ❤️ using FastAPI, Next.js, and GraphQL** 
