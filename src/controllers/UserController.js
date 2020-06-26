const User = require("../models/User");
const Yup = require("yup");
module.exports = {
    async index(req, res) {
        const users = await User.findAll({
            attributes: { exclude: ["password", "createdAt", "updatedAt"] },
            limit: 20,
            order: ["id"],
        });
        if (users.length === 0) {
            return res
                .status(404)
                .json({ error: "Não existem usuarios cadastrados" });
        }
        return res.json(users);
    },

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6).max(20),
        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Falha na validação" });
        }
        const userExists = await User.findOne({
            where: { email: req.body.email },
        });
        if (userExists) {
            return res.status(400).json({ error: "Usuario ja existe" });
        }
        const { id, name, email, password } = await User.create(req.body);
        return res.json({ id, name, email });
    },

    async search(req, res) {
        const { id } = req.params;
        const user = await User.findAll({
            where: { id: id },
            attributes: { exclude: ["password", "createdAt", "updatedAt"] },
        });

        if (user.length === 0) {
            return res.status(400).json({ error: "Usuario não encontrado" });
        }
        return res.json(user);
    },

    async change(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            password: Yup.string().min(6).max(20),
            confirmPassword: Yup.string().when("password", (password, field) =>
                password ? field.required().oneOf([Yup.ref("password")]) : field
            ),
        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Falha na validação" });
        }
        const { id } = req.params;
        const { name, email, password, confirmPassword } = req.body;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(400).json({ error: "Usuário não existe." });
        }
        if (user.email !== email) {
            const userExists = await User.findOne({
                where: { email },
            });
            if (userExists) {
                return res.status(400).json({ error: "Usuário ja existe." });
            }
        }
        if (password == null) {
            const user = await User.update(
                {
                    name,
                    email,
                },
                {
                    where: {
                        id,
                    },
                }
            );
            return res.json({ msg: "Informações alteradas com sucesso!" });
        } else {
            if (password === confirmPassword && confirmPassword !== null) {
                const user = await User.update(
                    {
                        name,
                        email,
                        password,
                    },
                    {
                        where: {
                            id,
                        },
                    }
                );
                return res.json({ msg: "Informações alteradas com sucesso!" });
            }
        }
    },

    async delete(req, res) {
        const { id } = req.params;
        const checkUser = await User.findByPk(id);

        if (checkUser) {
            const user = await User.destroy({
                where: {
                    id,
                },
            });
            return res.json({ msg: "Apagado com sucesso!" });
        } else {
            return res.status(404).json({ error: "Usuário não existe" });
        }
    },
};
