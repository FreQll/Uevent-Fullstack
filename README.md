# Uevent

### What is it? | [Uevent in Action](https://youtu.be/AOfKTPDs7r8?si=fbf64SAhms6WiGlX)

Join the excitement with UEvent! Our innovative platform brings people together for unforgettable experiences, offering tickets to the hottest parties, concerts, and events. 
Whether you're into music, art, or culture, UEvent connects you with the events you love, ensuring every moment is filled with excitement and adventure. 
Don't miss out on the fun – join UEvent and let the good times roll!
Built with advanced technologies including Next.js, React, Tailwind CSS, Shadcn/ui, and backend by the robust PostgreSQL database coupled with Prisma ORM and Express.js, 

----

### Setup

1. Firstly download project from this page and move to the folder:

```bash
git clone https://github.com/FreQll/Uevent-Fullstack.git
cd uevent
```

2. Then you need to setup **backend part**, for this:
   
    - Go to backend folder and install packages for it
      ``` bash
      cd backend
      npm i
      ```
    - Install Postgres and confirgure it, also change settings that will work for you in .env file
    - Run server
      ```bash
      npm run start
      ```
      
3. Then you need to setup **frontend part**, for this:
   - In project folder install all packages
     ```bash
     npm i
     ```
   - Run React application
     ```bash
     npm run dev
     ```

4. **For correct work of Stripe payments and Google Maps, you need to get their API keys and set them in .env files.**

----

### Technology Stack

- #### FrontEnd Part

    [![FrontEnd](https://skillicons.dev/icons?i=nextjs,react,tailwind&perline=3)](https://skillicons.dev)

    *Zustand as storage, Shadcn/ui as component library, axios*

- #### BackEnd Part

    [![BackEnd](https://skillicons.dev/icons?i=js,nodejs,express,postgres,prisma&perline=4)](https://skillicons.dev)

    *And also JWT for authorization, Nodemailer (for emails) and Postman for testing API. And also Stripe for payment system*
