# Quill - Frontend

A beautiful, modern note-taking application for developers built with Next.js, TypeScript, and Tailwind CSS.
---
## 🌍 Live Demo
[![Live Demo](https://img.shields.io/badge/Live-Demo-green?style=for-the-badge&logo=vercel)](https://quillnote.netlify.app/)
[![API Docs](https://img.shields.io/badge/API-Swagger-blue?style=for-the-badge&logo=swagger)](https://noteapp-backend-c60c.onrender.com/docs)
[![Backend Repo](https://img.shields.io/badge/Backend-Repository-black?style=for-the-badge&logo=github)](https://github.com/Antonynans/Noteapp-backend)

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
- A running Quill API server (see backend setup)

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd quill-frontend
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


## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

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


Made with ❤️ for developers
# Quill-frontend-
