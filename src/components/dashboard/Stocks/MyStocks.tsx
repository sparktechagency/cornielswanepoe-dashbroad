
import { BookmarkCheck, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';


import UpdateStockModal from './UpdateStockModal';
import DeleteConfirmModal from '../../Shared/DeleteConfirmModal';
import MyStockCard from './MyStockCard';
import { useDeleteStockMutation, useGetMyStocksQuery } from '../../../redux/features/stock/stockApi';
import ManagePagination from '../../Shared/ManagePagination';
import { getSearchParams } from '../../../utils/getSearchParams';
import Loader from '../../Shared/Loader';
import { useUpdateSearchParams } from '../../../utils/updateSearchParams';

const MyStocks = () => {
  const [selectStock, setSelectStock] = useState(null)
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const { data: stocksData, isLoading, refetch } = useGetMyStocksQuery({});
  const [deleteStock] = useDeleteStockMutation()

    const updateSearchParams = useUpdateSearchParams();
  const { searchTerm, page } = getSearchParams();

  useEffect(() => {
    refetch()
  }, [searchTerm, page]);

  // handleDelete
  const handleDelete = async () => {
    try {
      const response = await deleteStock((selectStock as any)?._id).unwrap();
      if (response?.message) {
        toast.success(response?.message);
        setDeleteModal(false);
        setSelectStock(null)
      }
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Failed to delete");
    }
  };

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
        {isLoading ? <Loader color='#ffffff' /> : stocksData?.data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-white/30 rounded-xl">
            <div className="w-14 h-14 rounded-full bg-[#E6C97A]/10 flex items-center justify-center mb-4">
              <BookmarkCheck className="w-6 h-6 text-[#E6C97A]/60" />
            </div>
            <p className="text-gray-400 text-sm">
              No stocks found..
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
            {stocksData?.data?.map((stock: any) =>
              <MyStockCard key={stock.id} item={stock} canExpressInterest={false} setSelectStock={setSelectStock} setDeleteModal={setDeleteModal} setOpenUpdateForm={setOpenUpdateForm} />
            )}
          </div>
        )}

        <ManagePagination meta={stocksData?.meta} />


        <DeleteConfirmModal
          open={deleteModal}
          onClose={() => setDeleteModal(false)}
          onConfirm={handleDelete}
          itemName={(selectStock as any)?.title}
        />
        <UpdateStockModal open={openUpdateForm} stock={selectStock} onClose={() => { setSelectStock(null); setOpenUpdateForm(false) }} />
      </div>

    </div>

  )
}

export default MyStocks