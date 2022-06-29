import mongoose from 'mongoose'
const MONGO_URI  = "mongodb+srv://chat:chat@cluster0.ky0aqm9.mongodb.net/prueba?retryWrites=true&w=majority"

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  }, () => console.log('Connected'))

const usuariosCollection = 'usuarios';

const UsuarioSchema = new mongoose.Schema({
    firstName: {type: String, required: true, max: 100},
    lastName: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 100},
    username: {type: String, required: true, max: 100},
    password: {type: String, required: true, max: 100}
})
const UserModel = mongoose.model(usuariosCollection, UsuarioSchema)
export default UserModel