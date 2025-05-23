
# PLATIK-SIMPLE-CHAT-APP
<p>
This is my very first full-stack project, combining both front-end and back-end development. It's a simple chat application created with the purpose of learning and demonstrating how WebSockets work in real time. it's meant to serve as a hands-on example for understanding the basics of WebSocket communication within a real-world context. While it's a simple app, it helped me grasp essential concepts like real-time messaging, client-server interaction, and overall web application structure.
</p>

![GENERAL HOME](https://github.com/user-attachments/assets/b422ac5e-a714-48aa-9d2e-23da71805948)

<h2>TECNOLOGIES/LIBRARIES USED</h2>

<p>
This is a simple app, so most of the libraries are from general use, i decided to use REACT REDUX as a state manager, because is one of the most complete tools to do it.
In the backend i implemented CLOUDINARY as an image hosting, because of its easy use and it has an already implemented API and Library in the javascript environment; 
Along with that i added: P-QUERY which is a library that control queues and avoids to saturate the server (EXAMPLE: Receiving houndres of messages in a short period).
</p>


<b>FRONTEND:</b>
<ul>
  <li>REACT REDUX/TOOLKIT (state management) </li>
  <li>REACT ROUTER DOM </li>
  <li>SOCKET.IO-CLIENT</li>
  <li>TAILWIND-CSS</li>
</ul>

<b>BACKEND: </b>
<ul>
  <li>EXPRESS</li>
  <li>SOCKET.IO</li>
  <li>JSON WEB TOKENS </li>
  <li>CLODINARY</li>
  <li>DOTENV</li>
  <li>MULTER</li>
  <li>P-QUEUE (Promise queue with concurrency control)</li>
</ul>

<h2>SECTIONS OF THE APP</h2>

<h3>CHAT INFORMATION MODAL</h3>

![CHAT MODAL INFO](https://github.com/user-attachments/assets/7d85807e-6ecb-4d20-8c1e-3ffcf0537516)

<b>FEATURES</b>
<ul>
  <li>[as a member]: Shows you the general Information of the chat (name, description, ...)</li>
  <li>[as an Admin]: Shows you the general Information of the chat (name, description, ...) AND lets you change the data in the input fields</li>
</ul>

<h3>CHAT MEMBERS MODAL</h3>

![CHAT MODAL MEMBERS](https://github.com/user-attachments/assets/271d6324-8f6c-43c9-96c8-43b78741daef)

<b>FEATURES</b>
<ul>
  <li>[as a member]: lets you see the Members of the chat</li>
  <li>[as a member]: lets you mute or leave the chat</li>
</ul>

![CHAT ADMIN](https://github.com/user-attachments/assets/859854f6-749b-4b4a-ad8c-0ff8e74aeb13)
<b>FEATURES</b>
<ul>
  <li>[as an Admin]: You can Add more users to the chat (if is a group chat)</li>
  <li>[as an Admin]: You can kick a user out from the chat</li>
  <li>[as an Admin]: displays a new tab called "Management" where the admin can delete all the messages or delete the entire group chat. </li>
</ul>


<h3>CREATE CHAT FORM</h3>

![CREATE CHAT FORM](https://github.com/user-attachments/assets/2aab7cdc-4f8b-4321-8d41-cd3267867346)
<b>FEATURES</b>
<ul>
  <li>Search and add users by its email</li>
  <li>Adds an image to the group chat</li>
  <li>Add a description (max length: 1200 characters)</li>
</ul>


<h3> USER INFORMATION SECTION</h3>

![MODIFY PROFILE INFO SECTION](https://github.com/user-attachments/assets/abdce08b-1a75-4bc5-b856-0b0612daf3b1)

<b>FEATURES</b>
<ul>
  <li>Change the name, Profile picture and "about" of the user</li>
</ul>

<h3>NOTIFICATIONS MODAL</h3>

![NOTIFICATIONS MODAL](https://github.com/user-attachments/assets/e74a2c87-0225-4f96-bf08-4f0750b75d8a)

<p>
This notification container displays all the notifications from each chat the user is part of, providing them in a more organized and detailed way. It helps users keep track of new messages and updates across different conversations on more detail.
</p>

<h3>PROFILE INFORMATION MODAL (GENERAL INFORMATION)</h3>

![Profile INFO MODAL](https://github.com/user-attachments/assets/abbc89dc-067d-413c-af0c-37ce27aa47e2)

<p>
This modal displays general information about a user, such as their name, email, and other basic details. It's designed to give a quick overview without needing to navigate away from the current view.
</p>

<h3>SEARCH MODAL</h3>

![SEARCH MODAL](https://github.com/user-attachments/assets/0a9c0ff3-6584-4641-b67d-0680bab1c160)
<p>
You can search any user that is registered on the web just by typing its email.
</p>

<h3>SETTINGS MODAL</h3>

![SETTINGS MODAL](https://github.com/user-attachments/assets/63153dd5-d40a-4f18-9bbd-0a1cef0d6080)

<b>You can change your preferences as you like, such as:</b>
<ul>
  <li>Change Font size</li>
  <li>Toggle dark and light mode</li>
  <li>Allow or disable general notifications</li>
  <li>Unmute chats</li>
</ul>


<p>If you find any bugs or issues with the page, or if you have suggestions for better ways to handle certain actions, feel free to let me know — I’ll do my best to improve it! ;) </p>










