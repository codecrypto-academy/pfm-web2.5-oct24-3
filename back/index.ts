import express from 'express'
import { Request,Response } from 'express'
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors());

const port = 3333;

//Petición Get 
app.get('/:p1/:p2/:p3', (req:Request, res:Response) => {
    const {p1,p2,p3} = req.params
    res.send (
        {p1,p2,p3}
    )
});

//Petición Post
app.post('/', (req:Request, res:Response) => {
    const body = req.body
    res.send (
        body
    );
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
}) 