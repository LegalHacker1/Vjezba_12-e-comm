const layout = require('../layout')

module.exports = ({ req }) => {
    return layout({ content: `
  
      <div>
        Your id is: ${req.session.userId}
            <form method="POST">
               <input name="email" placeholder="email" />
               <input name="password" placeholder="password" />
               <input name="passwordComfirmation" placeholder="password comfirmation" />
               <button>Sign up</button>
            </form>
      </div>


    `
  });
};