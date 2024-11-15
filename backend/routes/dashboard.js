const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = (db) => {
    const router = express.Router();

    // Obtener estadísticas generales
    router.get('/stats', async (req, res) => {
        try {
            const [owners, pets] = await Promise.all([
                db.collection('owners').find().toArray(),
                db.collection('pets').find().toArray()
            ]);

            const stats = {
                totalOwners: owners.length,
                totalPets: pets.length,
                recentOwners: owners.slice(-5).reverse(),
                recentPets: pets.slice(-5).reverse()
            };

            res.json(stats);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener estadísticas' });
        }
    });

    // Obtener actividad reciente
    router.get('/activity', async (req, res) => {
        try {
            const recentActivity = await db.collection('activity')
                .find()
                .sort({ timestamp: -1 })
                .limit(10)
                .toArray();

            res.json(recentActivity);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener actividad reciente' });
        }
    });

    // Obtener estadísticas mensuales
    router.get('/monthly-stats', async (req, res) => {
        try {
            const monthlyStats = await db.collection('pets').aggregate([
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } }
            ]).toArray();

            res.json(monthlyStats);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener estadísticas mensuales' });
        }
    });

    return router;
};