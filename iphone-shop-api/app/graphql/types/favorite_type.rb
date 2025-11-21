module Types
  class FavoriteType < Types::BaseObject
    field :id, ID, null: false
    field :product, ProductType, null: false
    field :user_id, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end