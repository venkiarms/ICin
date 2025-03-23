# MovieTheater Club Application - Reel Rover 



## Tech stack
REACTJS, TAILWIND CSS, VITE, NODEJS, EXPRESSJS, MONGODB, New

## Design Choices:

### Why NoSQL in a database?

- We opted for NoSQL instead of a relational framework because it uses unique languages for processing the stored data.
- This provides a database focused on developers, making the design and API access more straightforward.
- Developers can use databases without worrying about their underlying mechanics.
- NoSQL databases enable focusing on specific needs without imposing a fixed schema on the database.
  
### Why is MongoDB used?

- MongoDB supports varied data structures due to its secondary indexing, enhancing flexibility in data modeling.
- The schema-less nature of MongoDB means that defining a schema from the beginning is not necessary.

### Why MERN Stack - Performance and User Interface Rendering

- React JS excels in abstracting the UI layer. Being just a library, React allows for flexible application construction and code structuring, leading to superior UI rendering and            performance compared to Angular.
- Cost Efficiency
  The MERN Stack's reliance on JavaScript for all layers means a company can save time and money by hiring JavaScript experts instead of specialists for each distinct technology.
- Open Source and Cost-Free
  MERN Stack's exclusive use of open-source technologies enables developers to leverage community resources for solutions to development challenges.

## XP Core Values Maintained by Team
- **Simplicity** <br> Our approach prioritized implementing the simplest and most effective solutions. We designed the code to be modular and reusable, ensuring that it is easily understandable and modifiable by any team member in the future. Efforts were made to minimize code smells, and we included relevant comments for clarity. This approach has resulted in a straightforward code base that is easy to maintain.

- **Feedback** <br> By consistently giving and receiving feedback, we were able to learn, adapt to changes, and avoid repeating errors, enhancing our efficiency. Throughout the development process, we created pull requests and committed our changes to a branch. These changes were only merged into the master branch after receiving approval from another team member. This practice ensured that any updates to the master branch were stable and did not negatively impact other team members' work. Continuous feedback played a crucial role in aligning our goals and responsibilities.

- **Communication** <br> Effective communication was a cornerstone of our team's approach throughout the project. Initially, we collaboratively brainstormed the project's concept and distributed tasks among ourselves. We held regular sprint meetings where team members discussed challenges they encountered and conducted retrospectives on aspects that didn't go as planned. This open communication ensured a smooth project workflow and team synergy.

## Architecture Diagram
![Architecture diagram.png](https://github.com/gopinathsjsu/teamproject-strawhats/blob/main/Images/Architecture%20diagram.png)

## Deployment Diagram
![Component Diagram.jpeg](https://github.com/gopinathsjsu/teamproject-strawhats/blob/main/Images/Deployment%20diagram.png)

## UML Diagram
![Deployment diagram.png](https://github.com/gopinathsjsu/teamproject-strawhats/blob/main/Images/UML%20diagram.png)

## Component Diagram
![Component Diagram.jpeg](https://github.com/gopinathsjsu/teamproject-strawhats/blob/main/Images/Component%20Diagram.jpeg)

# Feature Set

### For all users:
View Home/Landing page showing information about the Theaters, locations, current movie schedules, and upcoming movies,
View membership option - Regular and Premium
View Registration/Signup page - viewable by all users
Book tickets for a movie
Each booking will include an online service fee ($1.50 per ticket)


### For Enrolled and logged in Members:
View members page - showing movie tickets purchased, rewards points accumulated
Regular membership is free
Premium membership is for an annual fee of 15 dollars
View list of Movies watched in the past 30 days
Book multiple seats (upto 8) for a movie show - using rewards points or payment method (pre-selected) - seats selected by the user
Cancel previous tickets before showtime and request refund
Accumulate rewards points (all members) 1 point per dollar
Premium members get online service fee waived for any booking


### Theater employees :
Add/update/remove movies/showtimes/theater assignment in the schedule
Configure seating capacity for each theater in a multiplex
View analytics dashboard showing Theater occupancy for the last 30/60/90 days
Summarized by location
Summarized by movies
Configure discount prices for shows before 6pm and for Tuesday shows

## UI Wireframes
![Adding page.jpg](https://github.com/gopinathsjsu/teamproject-strawhats/blob/main/Web%20UI%20Raw%20Designs/Adding%20page.jpg)
![Admin page UI.jpg](https://github.com/gopinathsjsu/teamproject-strawhats/blob/main/Web%20UI%20Raw%20Designs/Admin%20page%20UI.jpg)
![Analytics page UI.jpg](https://github.com/gopinathsjsu/teamproject-strawhats/blob/main/Web%20UI%20Raw%20Designs/Analytics%20page%20UI.jpg))
![Choosing a seat.jpg](https://github.com/gopinathsjsu/teamproject-strawhats/blob/main/Web%20UI%20Raw%20Designs/Choosing%20a%20seat.jpg)
![Adding page.jpg](https://github.com/gopinathsjsu/teamproject-strawhats/blob/main/Web%20UI%20Raw%20Designs/Adding%20page.jpg)
![Home Page UI.jpg](https://github.com/gopinathsjsu/teamproject-strawhats/blob/main/Web%20UI%20Raw%20Designs/Home%20Page%20UI.jpg)
![Movie theatre and showtime.jpg](https://github.com/gopinathsjsu/teamproject-strawhats/blob/main/Web%20UI%20Raw%20Designs/Movie%20theatre%20and%20showtime.jpg)
![Regsiter page web UI.jpg](https://github.com/gopinathsjsu/teamproject-strawhats/blob/main/Web%20UI%20Raw%20Designs/Regsiter%20page%20web%20UI.jpg)
![Rewards page.jpg](https://github.com/gopinathsjsu/teamproject-strawhats/blob/main/Web%20UI%20Raw%20Designs/Rewards%20page.jpg)

## Sprint BurnDown Chart
[Sprint Task Sheet and burndown strawhats.xlsx](https://github.com/gopinathsjsu/teamproject-strawhats/blob/main/Sprint%20Task%20Sheet%20and%20burndown%20strawhats.xlsx)

## Steps to run the application

1. git clone [repo](https://github.com/gopinathsjsu/team-project-ysmp.git)
2. Install dependencies for both frontend and backend npm install ```npm install```
3. Create .env file at /server :
```
PORT=8080
DATABASE=<your MongoDB connection string URI>
JWT_SECRET=<any random JWT secret>
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```
4. Run backend - ```npm run dev```
   Run frontend - ```npm run start```
