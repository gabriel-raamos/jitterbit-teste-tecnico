import db from '../config/database.js';

function mapInputToDb(body) {
    return {
        orderId: body.numeroPedido,
        value: body.valorTotal,
        creationDate: new Date(body.dataCriacao),
        items: (body.items || []).map((item) => ({
            productId: parseInt(item.idItem, 10),
            quantity: item.quantidadeItem,
            price: item.valorItem,
        })),
    };
}

export async function createOrder(body) {
    const conn = await db.getConnection();

    try {
        await conn.beginTransaction();
        const mapped = mapInputToDb(body);

        await conn.execute(
            "INSERT INTO `Order` (orderId, value, creationDate) VALUES (?, ?, ?)",
            [mapped.orderId, mapped.value, mapped.creationDate]
        );

        for (const item of mapped.items) {
            await conn.execute(
                'INSERT INTO Items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)',
                [mapped.orderId, item.productId, item.quantity, item.price]
            );
        }
        await conn.commit();
        return mapped;
    }

    catch (err) {
        await conn.rollback();
        console.err('Houve um erro na função "createOrder":', err.message);
        throw err;
    }

    finally {
        conn.release();
    }
}

export async function getOrderById(orderId) {
    const [orders] = await db.execute(
        'SELECT * FROM `Order` WHERE orderId = ?',
        [orderId]
    );

    if (orders.length === 0) return null;

    const [items] = await db.execute(
        'SELECT productId, quantity, price FROM Items WHERE orderId = ?',
        [orderId]
    );

    return { ...orders[0], items };
}

export async function getAllOrders() {
    const [orders] = await db.execute('SELECT * FROM `Order` ORDER BY creationDate DESC');

    const result = await Promise.all(
        orders.map(async (order) => {
            const [items] = await db.execute(
                'SELECT productId, quantity, price FROM Items WHERE orderId = ?',
                [order.orderId]
            );
            return { ...order, items };
        })
    );

    return result;
}

export async function updateOrder(orderId, body) {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const campos = [];
        const valores = [];

        if (body.valorTotal !== undefined) {
            campos.push('value = ?');
            valores.push(body.valorTotal);
        }
        if (body.dataCriacao !== undefined) {
            campos.push('creationDate = ?');
            valores.push(new Date(body.dataCriacao));
        }

        if (campos.length > 0) {
            valores.push(orderId);
            await conn.execute(
                `UPDATE \`Order\` SET ${campos.join(', ')} WHERE orderId = ?`,
                valores
            );
        }

        if (body.items !== undefined) {
            await conn.execute('DELETE FROM Items WHERE orderId = ?', [orderId]);
            for (const item of body.items) {
                await conn.execute(
                    'INSERT INTO Items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, parseInt(item.idItem, 10), item.quantidadeItem, item.valorItem]
                );
            }
        }

        await conn.commit();
        return getOrderById(orderId);
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}

export async function deleteOrder(orderId) {
    const [result] = await db.execute(
        'DELETE FROM `Order` WHERE orderId = ?',
        [orderId]
    );
    return result.affectedRows > 0;
}

