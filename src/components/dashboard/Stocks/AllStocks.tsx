
import { BookmarkCheck, Search } from 'lucide-react';
import { useEffect } from 'react';
import { useGetStocksQuery } from '../../../redux/features/stock/stockApi';
import { getSearchParams } from '../../../utils/getSearchParams';
import Loader from '../../Shared/Loader';
import ManagePagination from '../../Shared/ManagePagination';
import StockCard from './StockCard';
import { useUpdateSearchParams } from '../../../utils/updateSearchParams';

const StockPage = () => {
    const { data: stocksData, isLoading, refetch } = useGetStocksQuery({});
    const updateSearchParams = useUpdateSearchParams()
    const { searchTerm, page } = getSearchParams();

    useEffect(() => {
        // setSearchText(searchTerm);
        refetch()
    }, [searchTerm, page]);
    return (
        <div className="">
                        <div className=" flex items-center justify-end gap-5 rounded-lg mb-6">
                <div className="relative w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => { updateSearchParams({ searchTerm: e.target.value }) }}
                        placeholder="Search conversations..."
                        className="w-full bg-[#1A1A1A] border border-primary/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    />
                </div>                
            </div>
                <div className="space-y-4">
            {isLoading ? <Loader color='#ffffff'/> : stocksData?.data?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-white/30 rounded-xl">
                    <div className="w-14 h-14 rounded-full bg-[#E6C97A]/10 flex items-center justify-center mb-4">
                        <BookmarkCheck className="w-6 h-6 text-[#E6C97A]/60" />
                    </div>
                    <p className="text-gray-400 text-sm">
                        No requests found for this category.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
                    {stocksData?.data?.map((stock: any) =>
                        <StockCard key={stock.id} item={stock} canExpressInterest={false} />
                    )}
                </div>
            )}

            <ManagePagination meta={stocksData?.meta} />
        </div>
        </div>
    
    )
}

export default StockPage