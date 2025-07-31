// Sample data for testing Products and Orders
const sampleProducts = [
    {
        name: "The Witcher 3: Wild Hunt",
        description: "An action role-playing game with a vast open world",
        price: 29.99,
        originalPrice: 59.99,
        category: "RPG",
        platform: "PC",
        imageUrl: "https://example.com/witcher3.jpg",
        isSale: true,
        salePercentage: 50
    },
    {
        name: "Cyberpunk 2077",
        description: "An open-world action-adventure story",
        price: 39.99,
        originalPrice: 59.99,
        category: "RPG",
        platform: "PC",
        imageUrl: "https://example.com/cyberpunk.jpg",
        isSale: true,
        salePercentage: 33
    },
    {
        name: "Red Dead Redemption 2",
        description: "An epic tale of life in America's unforgiving heartland",
        price: 49.99,
        originalPrice: 49.99,
        category: "Action",
        platform: "PC",
        imageUrl: "https://example.com/rdr2.jpg",
        isSale: false,
        salePercentage: 0
    },
    {
        name: "Grand Theft Auto V",
        description: "Los Santos: a sprawling sun-soaked metropolis",
        price: 19.99,
        originalPrice: 59.99,
        category: "Action",
        platform: "PC",
        imageUrl: "https://example.com/gtav.jpg",
        isSale: true,
        salePercentage: 67
    },
    {
        name: "Minecraft",
        description: "Create, explore and survive!",
        price: 26.95,
        originalPrice: 26.95,
        category: "Sandbox",
        platform: "PC",
        imageUrl: "https://example.com/minecraft.jpg",
        isSale: false,
        salePercentage: 0
    }
];

const sampleOrders = [
    {
        userId: "user_id_here", // Replace with actual user ID
        items: [
            {
                productId: "product_id_here", // Replace with actual product ID
                quantity: 2,
                price: 29.99
            }
        ],
        totalAmount: 59.98,
        paymentMethod: "credit_card",
        status: "pending"
    }
];

module.exports = { sampleProducts, sampleOrders }; 