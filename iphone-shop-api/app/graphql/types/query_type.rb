module Types
  class QueryType < Types::BaseObject
    # Get a single object by ID
    field :node, Types::NodeType, null: true, description: "Fetches an object given its ID." do
      argument :id, ID, required: true, description: "ID of the object."
    end

    # Return the object from its ID
    def node(id:)
      context.schema.object_from_id(id, context)
    end

    # Get a list of objects by many IDs
    field :nodes, [Types::NodeType, null: true], null: true, description: "Fetches a list of objects given a list of IDs." do
      argument :ids, [ID], required: true, description: "IDs of the objects."
    end

    # Return all objects matching the list of IDs
    def nodes(ids:)
      ids.map { |id| context.schema.object_from_id(id, context) }
    end

     # Get all products with search, category filter, and sorting
    field :products, [ProductType], null: false do
      argument :search, String, required: false
      argument :category, String, required: false
      argument :sort_by, String, required: false
    end

    def products(search: nil, category: nil, sort_by: nil) # search, filter, sort for search control
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

    # Get a single product by ID
    field :product, ProductType, null: true do
      argument :id, ID, required: true
    end

    def product(id:)
      Product.find_by(id: id)
    end

    # Get a list of all unique product categories
    field :categories, [String], null: false

    def categories
      Product.distinct.pluck(:category).compact
    end

    # Get a user's favorite products
    field :favorites, [FavoriteType], null: false do
      argument :user_id, String, required: true
    end

    def favorites(user_id:)
      Favorite.includes(:product).where(user_id: user_id)
    end
  end
end