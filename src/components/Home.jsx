import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  getCategories,
  getProductsFromCategoryAndQuery,
  getCategoryById,
} from '../services/api';
import addCardClick from '../services/addCard';
import Header from './Header';

export default class Home extends Component {
  state = {
    search: '',
    categoriesList: [],
    cards: [],
    clicou: false,
  };

  componentDidMount() {
    this.fetchAPIgetCategories();
  }

  onInputChange = ({ target }) => {
    const { name, type } = target;
    const value = type === 'checkbox' ? target.checked : target.value;
    this.setState({ [name]: value });
  };

  fetchAPIgetCategories = async () => {
    const categories = await getCategories();
    this.setState({ categoriesList: categories });
  };

  handleClick = async () => {
    const { search } = this.state;
    const products = await getProductsFromCategoryAndQuery(null, search);
    this.setState({ cards: products.results, clicou: true });
  };

  categoryClick = async ({ target }) => {
    const { value } = target;
    const products = await getCategoryById(value);
    this.setState({ cards: products.results });
  };

  render() {
    const { search, categoriesList, cards, clicou } = this.state;
    const zero = 0;
    const string = 'Nenhum produto foi encontrado';

    return (
      <>
        <Header
          search={ search }
          onInputChange={ this.onInputChange }
          onClick={ this.handleClick }
        />
        <main className="main">
          <section className="categories">
            <p>Categorias</p>
            {categoriesList.map((e) => (
              <div key={ e.id }>
                <label htmlFor={ e.id } data-testid="category">
                  <input
                    value={ e.id }
                    type="radio"
                    name="category"
                    id={ e.id }
                    onClick={ this.categoryClick }
                  />
                  <span>{e.name}</span>
                </label>
              </div>
            ))}
          </section>
          <div>
            { search.length === zero && (
              <p data-testid="home-initial-message">
                Digite algum termo de pesquisa ou escolha uma categoria.
              </p>)}
            <div>
              { (cards.length === zero && clicou)
                ? (<p>{string}</p>)
                : (
                  <div className="product">
                    { cards.map((product) => (
                      <div className="products" key={ product.id }>
                        <Link
                          to={ `/ProductDetail/${product.id}` }
                          data-testid="product-detail-link"
                        >
                          <div
                            data-testid="product"
                          >
                            <p>{product.title}</p>
                            <img src={ product.thumbnail } alt={ product.title } />
                            <p>{product.price}</p>
                          </div>
                        </Link>
                        <button
                          type="button"
                          data-testid="product-add-to-cart"
                          onClick={ () => addCardClick(product) }
                        >
                          Adicionar ao Carrinho
                        </button>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </main>
      </>
    );
  }
}