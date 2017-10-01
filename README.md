# CODEnSIT

This project is made by me and [Anshul Kumar Singh](https://github.com/anshul98ks123)

You can easily **Chat** and start a **VideoCall** on a local server using this

A Self Signed certificate is attached to it so that a **https** connection can be established. You can change the self signed certificate to your own.

It uses

* Node JS
* MongoDB

## For Running

* `git clone <repo-url>` to your preffered place
* cd into this repo
* `npm install`
* IN *chat.ejs* file
   Search for `<your-ip-here>` ans replace it with your ip
  
   In order to find your ip 
   On terminal write `ifconfig` and copy the ip address infront of `inet addr`
  
* Now to run the app run this command

 `PORT = 'Your-desired-port-here' node app.js`

To access the app go to your favourite browser and in the url type
`https://<your-ip-here>:<your desired-port-here>`

You will have to add a security exception in case you are using a self signed certificate

Someone else on the same network can access this app similarly if your server is running
