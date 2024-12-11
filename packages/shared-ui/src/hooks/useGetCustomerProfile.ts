import { useQuery } from '@tanstack/react-query';
import { customerProfileCardGeneratedMock } from '../mocks';

const getMockCustomerProfile = async (brandId: string, memberUuid: string) => {
  console.log('getMockCustomerProfile', { brandId, memberUuid });
  await new Promise((resolve) => setTimeout(resolve, 200));

  // return customerProfileNoCardMock;
  return customerProfileCardGeneratedMock;
  // return customerProfileCardNotGeneratedMock;
};

export const useGetCustomerProfile = (brandId: string, memberUuid: string) => {
  return useQuery({
    queryKey: ['customerProfile', brandId, memberUuid],
    queryFn: async () => getMockCustomerProfile(brandId, memberUuid),
  });
};

// [TODO]: Use the below when the endpoint has been deployed
// export const useGetCustomerProfile = (brandId: string, memberUuid: string) => {
//   const platformAdapter = usePlatformAdapter();

//   return useQuery({
//     queryKey: ['customerProfile', brandId, memberUuid],
//     queryFn: async () => {
//       let response;

//       try {
//         response = await platformAdapter.invokeV5Api(
//           `/members/v5/customer/${brandId}/${memberUuid}`,
//           {
//             method: 'GET',
//           }
//         );
//       } catch (err) {
//         // await new Promise((resolve) => setTimeout(resolve, 200));
//         // return customerProfileMock;
//       }

//       if (response?.status !== 200)
//         throw new Error('Received error when trying to retrieve customer profile');

//       try {
//         const customerProfile = JSON.parse(response?.data)?.data as CustomerProfileData;
//         return customerProfile;
//       } catch (err) {
//         throw new Error('Invalid customer profile data received');
//       }
//     },
//   });
// };
