import AdminLayout from "@components/layouts/AdminLayout";

export default function Settings() {
  return (
    <>
      <AdminLayout menuTitle='goodman'>
        <div className='flex flex-wrap'>
          <div className='w-full px-4 mb-12 xl:w-8/12 xl:mb-0'>
            <div>사용자리스트</div>
          </div>
          <div className='w-full px-4 xl:w-4/12'>좋아</div>
        </div>
        <div className='flex flex-wrap mt-4'>
          <div className='w-full px-4 mb-12 xl:w-8/12 xl:mb-0'>여기에</div>
          <div className='w-full px-4 xl:w-4/12'>가자</div>
        </div>
      </AdminLayout>
    </>
  );
}
