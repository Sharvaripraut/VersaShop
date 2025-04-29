import React from 'react';
import PropTypes from 'prop-types';
import getRowClasses from './form/fields/editor/GetRowClasses';
import getColumnClasses from './form/fields/editor/GetColumnClasses';

function Paragraph({ data }) {
  return (
    <p 
      className="leading-relaxed text-gray-700 mb-5" 
      dangerouslySetInnerHTML={{ __html: data.text }} 
    />
  );
}

Paragraph.propTypes = {
  data: PropTypes.shape({
    text: PropTypes.string.isRequired
  }).isRequired
};

function Header({ data }) {
  const Tag = `h${data.level}`;
  const headerClasses = {
    1: 'text-3xl font-bold text-gray-900 mb-6 leading-tight',
    2: 'text-2xl font-semibold text-gray-800 mb-5 leading-tight',
    3: 'text-xl font-medium text-gray-800 mb-4',
    4: 'text-lg font-medium text-gray-700 mb-3',
    5: 'text-base font-medium text-gray-700 mb-3',
    6: 'text-sm font-medium text-gray-700 mb-3'
  };
  
  return (
    <Tag className={headerClasses[data.level] || ''}>
      {data.text}
    </Tag>
  );
}

Header.propTypes = {
  data: PropTypes.shape({
    level: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired
};

function List({ data }) {
  return (
    <ul className="list-disc pl-5 mb-6 text-gray-700 space-y-1.5">
      {data.items.map((item, index) => (
        <li key={index} className="mb-1">{item}</li>
      ))}
    </ul>
  );
}

List.propTypes = {
  data: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired
};

function Quote({ data }) {
  return (
    <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-5 italic text-gray-700 relative">
      <p className="mb-1">&quot;{data.text}&quot;</p>
      {data.caption && (
        <cite className="block text-right text-sm text-gray-500 mt-2 not-italic">
          — {data.caption}
        </cite>
      )}
    </blockquote>
  );
}

Quote.propTypes = {
  data: PropTypes.shape({
    text: PropTypes.string.isRequired,
    caption: PropTypes.string
  }).isRequired
};

function Image({ data }) {
  const { file, caption, withBorder, withBackground, stretched, url } = data;

  const imageContainerClasses = [
    'my-6',
    withBackground ? 'bg-gray-50 p-3 rounded-md' : ''
  ].filter(Boolean).join(' ');
  
  const imageClasses = [
    'max-w-full h-auto mx-auto rounded-lg',
    withBorder ? 'border border-gray-200' : '',
    stretched ? 'w-full' : ''
  ].filter(Boolean).join(' ');

  const imageElement = (
    <img 
      src={file.url} 
      alt={caption || 'Image'} 
      className={imageClasses}
      loading="lazy"
    />
  );

  return (
    <div className={imageContainerClasses}>
      <figure>
        {url ? (
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block transition-opacity hover:opacity-90"
          >
            {imageElement}
          </a>
        ) : (
          imageElement
        )}
        {caption && (
          <figcaption className="text-center text-sm text-gray-500 mt-2">
            {caption}
          </figcaption>
        )}
      </figure>
    </div>
  );
}

Image.propTypes = {
  data: PropTypes.shape({
    file: PropTypes.shape({
      url: PropTypes.string.isRequired
    }).isRequired,
    caption: PropTypes.string,
    withBorder: PropTypes.bool,
    withBackground: PropTypes.bool,
    stretched: PropTypes.bool,
    url: PropTypes.string
  }).isRequired
};

function RawHtml({ data }) {
  return (
    <div className="raw-html-container my-4" dangerouslySetInnerHTML={{ __html: data.html }} />
  );
}

RawHtml.propTypes = {
  data: PropTypes.shape({
    html: PropTypes.string.isRequired
  }).isRequired
};

function RenderEditorJS({ blocks }) {
  return (
    <div className="prose prose-base max-w-none">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return <Paragraph key={index} data={block.data} />;
          case 'header':
            return <Header key={index} data={block.data} />;
          case 'list':
            return <List key={index} data={block.data} />;
          case 'image':
            return <Image key={index} data={block.data} />;
          case 'quote':
            return <Quote key={index} data={block.data} />;
          case 'raw':
            return <RawHtml key={index} data={block.data} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

RenderEditorJS.propTypes = {
  blocks: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      // eslint-disable-next-line react/forbid-prop-types
      data: PropTypes.object.isRequired
    })
  ).isRequired
};

export default function Editor({ rows }) {
  return (
    <div className="editor__html">
      {rows.map((row, index) => {
        const rowClasses = getRowClasses(row.size);
        return (
          <div
            className={`row__container mt-12 grid md:${rowClasses} grid-cols-1 gap-8`}
            key={index}
          >
            {row.columns.map((columnIndex, index) => {
              const columnClasses = getColumnClasses(columnIndex.size);
              return (
                <div
                  className={`column__container md:${columnClasses} col-span-1 rounded-lg overflow-hidden`}
                  key={index}
                >
                  {columnIndex.data?.blocks && (
                    <RenderEditorJS blocks={columnIndex.data?.blocks} />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

Editor.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      size: PropTypes.number.isRequired,
      columns: PropTypes.arrayOf(
        PropTypes.shape({
          size: PropTypes.number.isRequired,
          // eslint-disable-next-line react/forbid-prop-types
          data: PropTypes.object
        })
      ).isRequired
    })
  ).isRequired
};
