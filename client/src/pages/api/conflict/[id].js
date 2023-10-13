export default function handler(req, res) {
    const { id } = req.query;
    res.status(200).json({ message: `${id} from Next.js!` });
}
