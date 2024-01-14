import { dbConnect } from '../database/src';

export async function getServerSideProps() {
  await dbConnect();
}
