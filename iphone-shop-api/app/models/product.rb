class Product < ApplicationRecord
  has_many :favorites, dependent: :destroy
  
  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than: 0 }
  validates :category, presence: true
  
  scope :search, ->(term) {
    where("name ILIKE ? OR model ILIKE ?", "%#{term}%", "%#{term}%")
  }
  
  scope :by_category, ->(category) {
    where(category: category) if category.present?
  }
  
  scope :sort_by_price_asc, -> { order(price: :asc) }
  scope :sort_by_price_desc, -> { order(price: :desc) }
  scope :sort_by_name, -> { order(name: :asc) }
  scope :sort_by_stock, -> { order(stock: :desc) }
end