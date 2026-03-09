import * as OrderModel from '../models/orderModel.js'

export async function createOrder(req, res) {
    try {
        const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

        if (!numeroPedido || valorTotal === undefined || !dataCriacao || !items) {
            return res.status(400).json({
                error: 'Algum campo está ausente, verifique: numeroPedido, valorTotal, dataCriacao, items',
            });
        }

        const order = await OrderModel.createOrder(req.body);
        return res.status(201).json({ message: 'Pedido foi criado com sucesso', order });
    }

    catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Já existe um pedido com esse número' });
        }
        return res.status(500).json({ error: 'Erro interno ao criar o pedido' });
    }
}

export async function getOrder(req, res) {
    try {
        const order = await OrderModel.getOrderById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ error: 'Id do pedido não foi encontrado' });
        }

        return res.status(200).json(order);
    } catch (err) {
        return res.status(500).json({ error: 'Erro interno ao buscar o pedido.' });
    }
}

export async function listOrders(req, res) {
    try {
        const orders = await OrderModel.getAllOrders();
        return res.status(200).json(orders);
    } catch (err) {
        console.error('[listOrders]', err);
        return res.status(500).json({ error: 'Erro interno ao listar os pedidos' });
    }
}

export async function updateOrder(req, res) {
    try {
        const { orderId } = req.params;

        const existing = await OrderModel.getOrderById(orderId);
        if (!existing) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        const updated = await OrderModel.updateOrder(orderId, req.body);
        return res.status(200).json({ message: 'Pedido atualizado com sucesso', order: updated });
    } catch (err) {
        return res.status(500).json({ error: 'Erro interno ao atualizar o pedido' });
    }
}

export async function deleteOrder(req, res) {
    try {
        const deleted = await OrderModel.deleteOrder(req.params.orderId);

        if (!deleted) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        return res.status(200).json({ message: 'Pedido removido com sucesso' });
    } catch (err) {
        return res.status(500).json({ error: 'Erro interno ao remover o pedido' });
    }
}
