class CreateProducts < ActiveRecord::Migration[7.0]
  def change
    create_table :products do |t|
      t.string :name, null: false
      t.text :description
      t.decimal :price, precision: 10, scale: 2, null: false
      t.string :model
      t.string :color
      t.string :storage
      t.string :category, null: false
      t.integer :stock, default: 0

      t.timestamps
    end

    add_index :products, :category
    add_index :products, :name
  end
end