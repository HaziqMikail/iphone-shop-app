module Types
  class QueryType < Types::BaseObject
    field :node, Types::NodeType, null: true, description: "Fetches an object given its ID." do
      argument :id, ID, required: true, description: "ID of the object."
    end

    def node(id:)
      context.schema.object_from_id(id, context)
    end

    field :nodes, [Types::NodeType, null: true], null: true, description: "Fetches a list of objects given a list of IDs." do
      argument :ids, [ID], required: true, description: "IDs of the objects."
    end

    def nodes(ids:)
      ids.map { |id| context.schema.object_from_id(id, context) }
    end

    field :products, [ProductType], null: false do
      argument :search, String, required: false
      argument :category, String, required: false
      argument :sort_by, String, required: false
    end

    def products(search: nil, category: nil, sort_by: nil)
      products = Product.all
      products = products.search(search) if search.present?
      products = products.by_category(category) if category.present?
      
      products = case sort_by
      when 'price_asc'
        products.sort_by_price_asc
      when 'price_desc'
        products.sort_by_price_desc
      when 'name'
        products.sort_by_name
      when 'stock'
        products.sort_by_stock
      else
        products.order(created_at: :desc)
      end
      
      products
    end

    field :product, ProductType, null: true do
      argument :id, ID, required: true
    end

    def product(id:)
      Product.find_by(id: id)
    end

    field :categories, [String], null: false

    def categories
      Product.distinct.pluck(:category).compact
    end

    field :favorites, [FavoriteType], null: false do
      argument :user_id, String, required: true
    end

    def favorites(user_id:)
      Favorite.includes(:product).where(user_id: user_id)
    end
  end
end