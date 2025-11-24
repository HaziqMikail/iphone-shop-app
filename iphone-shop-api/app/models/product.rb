class Product < ApplicationRecord
  has_many :favorites, dependent: :destroy
  
  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than: 0 }
  validates :category, presence: true
  
  scope :search, ->(term) { # Scope to search products by name or model
    where("name ILIKE ? OR model ILIKE ?", "%#{term}%", "%#{term}%")
  }
  
  scope :by_category, ->(category) { # Scope to filter products by category
    where(category: category) if category.present?
  }
  
  scope :sort_by_price_asc, -> { order(price: :asc) } # Scope to sort products by price in ascending order
  scope :sort_by_price_desc, -> { order(price: :desc) } # Scope to sort products by price in descending order
  scope :sort_by_name, -> { order(name: :asc) } # Scope to sort products by name in ascending order
  scope :sort_by_stock, -> { order(stock: :desc) } # Scope to sort products by stock in descending order
end