import PropTypes from 'prop-types';
import React from 'react';
import '@components/frontStore/catalog/product/list/item/Thumbnail.scss';
import ProductNoThumbnail from '@components/common/ProductNoThumbnail';

function Thumbnail({ url, imageUrl, alt }) {
  return (
    <div className="product-thumbnail-listing">
      <a href={url} className="thumbnail-link">
        <div className="thumbnail-container">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={alt} 
              className="product-image"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
          ) : (
            <div className="no-image">
              <ProductNoThumbnail width={120} height={120} />
            </div>
          )}
        </div>
        <div className="thumbnail-overlay">
          <span className="view-product">View Product</span>
        </div>
      </a>
    </div>
  );
}

Thumbnail.propTypes = {
  alt: PropTypes.string,
  imageUrl: PropTypes.string,
  url: PropTypes.string
};

Thumbnail.defaultProps = {
  alt: '',
  imageUrl: '',
  url: ''
};

export { Thumbnail };
