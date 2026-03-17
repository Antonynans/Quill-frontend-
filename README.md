# DevNote - Frontend

A beautiful, modern note-taking application for developers built with Next.js, TypeScript, and Tailwind CSS.

## Features

✨ **Modern UI/UX**
- Clean, intuitive interface designed for productivity
- Responsive design that works on desktop, tablet, and mobile
- Smooth animations and transitions

📝 **Note Management**
- Create, read, update, and delete notes
- Organize notes by skills/technologies
- Search notes across title and content
- View note status (created/updated)

🔐 **Authentication**
- User signup and login
- Secure token-based authentication
- Protected routes

🏷️ **Skill-Based Organization**
- Filter notes by programming languages and skills
- Quick skill filtering with visual feedback
- Track which skills you're learning

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Date Formatting**: date-fns

## Prerequisites

- Node.js 18+ and npm/yarn
- A running DevNote API server (see backend setup)

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd devnote-frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and update the API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. **Start the development server**
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home/dashboard page
│   ├── globals.css        # Global styles
│   └── auth/
│       ├── login/         # Login page
│       └── signup/        # Signup page
├── components/            # Reusable components
│   ├── Header.tsx         # Navigation header
│   ├── NoteCard.tsx       # Note card component
│   ├── NoteModal.tsx      # Create/edit modal
│   ├── SkillFilter.tsx    # Skill filter component
│   └── AuthWrapper.tsx    # Auth protection wrapper
├── store/                 # Zustand stores
│   ├── authStore.ts       # Authentication state
│   └── notesStore.ts      # Notes state
└── types/                 # TypeScript types
    └── index.ts           # Shared types
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Authentication

### Demo Credentials
Email: `demo@example.com`
Password: `demo123`

### Login Flow
1. User navigates to `/auth/login`
2. Enters email and password
3. API returns access token
4. Token stored in Zustand store (persisted to localStorage)
5. User redirected to dashboard

### Signup Flow
1. User navigates to `/auth/signup`
2. Creates account with email and password
3. API returns access token
4. Token stored and user redirected to dashboard

## API Integration

The application connects to a FastAPI backend with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Notes
- `GET /api/notes` - Fetch notes (with optional skill filter)
- `POST /api/notes` - Create new note
- `PATCH /api/notes/{id}` - Update note
- `DELETE /api/notes/{id}` - Delete note

## Component Guide

### Header
Navigation bar with user info and logout button.

```tsx
<Header />
```

### NoteCard
Displays individual note with quick actions.

```tsx
<NoteCard 
  note={note} 
  onEdit={handleEdit} 
  onView={handleView} 
/>
```

### NoteModal
Modal for creating, editing, or viewing notes.

```tsx
<NoteModal
  note={selectedNote}
  isOpen={isModalOpen}
  onClose={handleClose}
  mode="create" | "edit" | "view"
/>
```

### SkillFilter
Filter notes by skill/technology.

```tsx
<SkillFilter 
  skills={['JavaScript', 'Python']}
  selectedSkill={selected}
  onSkillChange={handleChange}
/>
```

## Customization

### Colors
Edit Tailwind theme in `tailwind.config.ts`:

```ts
theme: {
  extend: {
    colors: {
      orange: { /* ... */ }
    }
  }
}
```

### API Base URL
Update in `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-api.com
```

### Skills List
Edit the `SKILLS` array in `src/components/NoteModal.tsx`:
```ts
const SKILLS = ['Java', 'Python', 'JavaScript', ...]
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables (Production)
Set these in your deployment platform:
- `NEXT_PUBLIC_API_URL` - Your production API URL

## Performance

- **Image Optimization**: Next.js Image component (when applicable)
- **Code Splitting**: Automatic route-based splitting
- **CSS Optimization**: Tailwind CSS purging
- **Lazy Loading**: Dynamic imports where beneficial

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus states on interactive elements
- Color contrast meets WCAG standards

## Error Handling

The application includes:
- API error handling with user-friendly messages
- Form validation with clear feedback
- Network error recovery
- Session expiration handling

## Troubleshooting

### API Connection Issues
1. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
2. Check if backend server is running
3. Ensure CORS is properly configured on backend

### Authentication Problems
1. Clear browser cache and localStorage
2. Check token expiration
3. Verify credentials

### Build Issues
1. Delete `node_modules` and `.next`
2. Run `npm install` again
3. Clear npm cache: `npm cache clean --force`

## Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check existing issues
2. Create a new issue with detailed description
3. Include steps to reproduce
4. Provide screenshots if applicable

## Future Enhancements

- [ ] Offline support with service workers
- [ ] Rich text editor for notes
- [ ] Code syntax highlighting
- [ ] Note sharing and collaboration
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Cloud backup and sync
- [ ] AI-powered tagging
- [ ] Note templates

---

Made with ❤️ for developers
# Quill-frontend-
