
import { getBrosAction, type User } from "./getBrosAction";

import MembersClient from "./UsersList";

export default async function Members() {

    const users = (await getBrosAction()) as User[];
  return <MembersClient users={users} />;

}