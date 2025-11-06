
import { getBrosAction, type User } from "./getBrosAction";

import MembersClient from "./UsersList";

export default async function Members() {

    const users = (await getBrosAction()) as User[];
    console.log(users)
  return <MembersClient users={users} />;

}