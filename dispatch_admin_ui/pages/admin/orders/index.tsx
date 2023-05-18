import AdminLayout from "@components/layouts/AdminLayout";

export default function Manager() {
  return (
    <>
      <AdminLayout menuTitle='goodman'>
        <div className='flex flex-wrap'>
          <div className='w-full px-4 mb-12 xl:w-8/12 xl:mb-0'>
            <div>사용자리스트</div>
          </div>
        </div>
        <div className='flex flex-col'>
          <div className='overflow-x-auto sm:-mx-6 lg:-mx-8'>
            <div className='inline-block min-w-full py-2 sm:px-6 lg:px-8'>
              <div className='overflow-hidden'>
                <table className='min-w-full'>
                  <thead className='bg-white border-b'>
                    <tr>
                      <th
                        scope='col'
                        className='px-6 py-4 text-sm font-medium text-left text-gray-900'
                      >
                        ID
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-4 text-sm font-medium text-left text-gray-900'
                      >
                        Email
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-4 text-sm font-medium text-left text-gray-900'
                      >
                        Name
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-4 text-sm font-medium text-left text-gray-900'
                      >
                        Phone
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-4 text-sm font-medium text-left text-gray-900'
                      >
                        profile
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-4 text-sm font-medium text-left text-gray-900'
                      >
                        생성일
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-4 text-sm font-medium text-left text-gray-900'
                      >
                        수정일
                      </th>

                      <th
                        scope='col'
                        className='px-6 py-4 text-sm font-medium text-left text-gray-900'
                      >
                        활성화
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className='bg-gray-100 border-b'>
                      <td className='px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap'>
                        1
                      </td>
                      <td className='px-6 py-4 text-sm font-light text-gray-900 whitespace-nowrap'>
                        Mark
                      </td>
                      <td className='px-6 py-4 text-sm font-light text-gray-900 whitespace-nowrap'>
                        Otto
                      </td>
                      <td className='px-6 py-4 text-sm font-light text-gray-900 whitespace-nowrap'>
                        @mdo
                      </td>
                      <td className='px-6 py-4 text-sm font-light text-gray-900 whitespace-nowrap'>
                        @mdo
                      </td>
                      <td className='px-6 py-4 text-sm font-light text-gray-900 whitespace-nowrap'>
                        @mdo
                      </td>
                      <td className='px-6 py-4 text-sm font-light text-gray-900 whitespace-nowrap'>
                        @mdo
                      </td>
                      <td className='px-6 py-4 text-sm font-light text-gray-900 whitespace-nowrap'>
                        @mdo
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
