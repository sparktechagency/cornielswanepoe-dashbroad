
import { BookmarkCheck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';


import UpdateStockModal from './UpdateStockModal';
import DeleteConfirmModal from '../../Shared/DeleteConfirmModal';
import MyStockCard from './MyStockCard';
import { useDeleteStockMutation, useGetMyStocksQuery } from '../../../redux/features/stock/stockApi';

const MyStocks = () => {
  const { data: stocksData } = useGetMyStocksQuery({});
  const [selectStock, setSelectStock] = useState(null)
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [deleteStock] = useDeleteStockMutation()

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
    <div className="space-y-4">
      {stocksData?.data?.length === 0 ? (
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
      <DeleteConfirmModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        itemName={(selectStock as any)?.title}
      />
      <UpdateStockModal open={openUpdateForm} stock={selectStock} onClose={() => { setSelectStock(null); setOpenUpdateForm(false) }} />
    </div>
  )
}

export default MyStocks