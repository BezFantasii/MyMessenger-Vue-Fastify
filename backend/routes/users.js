
import bcrypt from 'bcrypt'
async function routes (fastify, options) {

  
  fastify.get('/users', async (request, reply) => {
      try {
        const res = await fastify.pg.query(`SELECT * FROM users;`);
        return res.rows;
      } catch (error) {
        reply.code(500).send({ error: error.message });
      }
    });

    fastify.get('/users/:id', async (request, reply) => {
        try {
          const {id} = request.params
          const res = await fastify.pg.query(`SELECT * FROM users WHERE id=$1`,[id]);

          if (res.rowCount === 0) {
            reply.code(404).send({ error: 'User not found' });
          } else {
            return res.rows[0];
          }
        } catch (error) {
          reply.code(500).send(error);
        }
      });
    
      fastify.post('/users/signup', async (request, reply) => {
        try {
          const {login, password} = request.body;

          const hash = await bcrypt.hash(password, 10);
          const logg = await fastify.pg.query(`SELECT * FROM users WHERE login = $1;`, [login],)
          if (logg.rowCount===0){
          const res = await fastify.pg.query(
           
            `INSERT INTO users(login, password) VALUES($1, $2) RETURNING *;`,
             [login, hash],
          );          
          return res.rows[0];}
          else{
            reply.code(404).send({ error: 'User already exists' });
          }
        } catch (error) {
          reply.code(500).send({ error: error.message });
        }
      });
    
      fastify.post('/users/signin', async (request, reply) =>{
        const{login, password} = request.body;
        try{
          const res =  await fastify.pg.query(`SELECT * FROM users WHERE login = $1`, [login]);
          console.log(res.rows);

          if(res.rowCount === 0) {
            reply.code(404).send({message : 'User not founded'});
          }else{

            const users = res.rows[0];
            const isValid = await bcrypt.compare(password.toString(), users.password);
            if(isValid){
              reply.code(200).send({
              status: 200,
              login: login,
              score: users.score,
              id: users.id
            });
            }else{
            return reply.code(401).send({
              failed: 'Unauthorized Access'
            });
          }
        }
      }catch(err){
        reply.code(500).send(err);
      }
    });
  
}  


export default routes