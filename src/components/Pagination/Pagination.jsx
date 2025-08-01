import './Pagination.css'

export function Pagination({ currentPage, onPageChange, lastPage }) {
    const totalPages = lastPage;
    const maxPageButtons = 3;

    const generatePageNumbers = () => {
        let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

        if (endPage - startPage < maxPageButtons - 1) {
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    const pageNumbers = generatePageNumbers();

    return (
        <div className='pagination'>
            {currentPage > 1 && (
                <button className='btn' onClick={() => onPageChange(currentPage - 1)}>Anterior</button>
            )}
            <div className="number-of-pages">
                {pageNumbers[0] > 1 && (
                    <>
                        <button className='btn' onClick={() => onPageChange(1)}>1</button>
                        {pageNumbers[0] > 2 && <span>...</span>}
                    </>
                )}
                {pageNumbers.map(page => (
                    <button
                        key={page}
                        className={page === currentPage ? 'page-active btn' : 'btn'}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                ))}
                {pageNumbers[pageNumbers.length - 1] < totalPages && (
                    <>
                        {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span>...</span>}
                        <button className='btn' onClick={() => onPageChange(lastPage)}>{totalPages}</button>
                    </>
                )}
            </div>
            {currentPage < totalPages && (
                <button className='btn' onClick={() => onPageChange(currentPage + 1)}>Siguiente</button>
            )}
        </div>
    );
};