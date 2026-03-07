
import { BookmarkCheck } from 'lucide-react';
import { useGetStocksQuery } from '../../../redux/features/stock/stockApi';
import StockCard from './StockCard';
import Loader from '../../Shared/Loader';

const StockPage = () => {
    const { data: stocksData, isLoading } = useGetStocksQuery({});
    return (
        <div className="space-y-4">
            {isLoading ? <Loader /> : stocksData?.data?.length === 0 ? (
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
        </div>
    )
}

export default StockPage