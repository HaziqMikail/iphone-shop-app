# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

Product.destroy_all

products = [
  {
    name: 'iPhone 15 Pro Max',
    description: 'Latest flagship with A17 Pro chip',
    price: 1199.00,
    model: '15 Pro Max',
    color: 'Natural Titanium',
    storage: '256GB',
    category: 'Pro Models',
    stock: 15
  },
  {
    name: 'iPhone 15 Pro',
    description: 'Pro model with titanium design',
    price: 999.00,
    model: '15 Pro',
    color: 'Blue Titanium',
    storage: '128GB',
    category: 'Pro Models',
    stock: 20
  },
  {
    name: 'iPhone 15 Plus',
    description: 'Large screen standard model',
    price: 899.00,
    model: '15 Plus',
    color: 'Black',
    storage: '256GB',
    category: 'Standard Models',
    stock: 25
  },
  {
    name: 'iPhone 15',
    description: 'Standard latest generation',
    price: 799.00,
    model: '15',
    color: 'Pink',
    storage: '128GB',
    category: 'Standard Models',
    stock: 30
  },
  {
    name: 'iPhone 14',
    description: 'Previous generation value',
    price: 699.00,
    model: '14',
    color: 'Purple',
    storage: '128GB',
    category: 'Previous Gen',
    stock: 40
  },
  {
    name: 'iPhone SE',
    description: 'Budget-friendly option',
    price: 429.00,
    model: 'SE',
    color: 'Midnight',
    storage: '64GB',
    category: 'Budget',
    stock: 50
  }
]

products.each do |product_data|
  Product.create!(product_data)
end

puts "Created #{Product.count} products"