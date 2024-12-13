import React, { useState } from 'react';
import { Button } from '../ui/Button';
import Popin from '../ui/Popin';
import { useFetchUsers } from '@/lib/users/hooks/useFetchUsers'; // Ensure this hook exists
import { useManageContestUsers } from '@/lib/contests/hooks/useManageContestUsers'; // Use the new hook
import { ContestUser, Gender } from '@/domain/ContestUser.schema';
import UserCard from '../users/UserCard'; // Import UserCard
import ContestUserCard from '../users/ContestUserCard'; // Import ContestUserCard
import { User } from '@/domain/User.schema';
import ConfirmationDialog from '../ui/ConfirmDialog'; // Import ConfirmationDialog

interface UserTabContentProps {
  contestId: number;
  isOpener: boolean;
  contestUsers: ContestUser[];
  onRemoveUser: (user: ContestUser) => void;
  onAddUser: (user: ContestUser) => void;
}

const UserTabContent: React.FC<UserTabContentProps> = ({ contestId, isOpener, contestUsers, onRemoveUser, onAddUser }) => {
  const [isUserPopinOpen, setUserPopinOpen] = useState<boolean>(false);
  const [isTempUserPopinOpen, setTempUserPopinOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false); // New state for confirmation dialog
  const [userToRemove, setUserToRemove] = useState<ContestUser | null>(null); // State to hold the user to be removed
  const { fetchUsers, isLoading: isLoadingUsers } = useFetchUsers();
  const { addUser, deleteUser } = useManageContestUsers(); // Use the new hook
  const [users, setUsers] = useState<User[]>([]);

  const handleAddUserInApp = async (user: User) => {
    const contestUserId = await addUser(contestId, user.id, Gender.Male); // Default gender for example
    if (contestUserId) {
      // Optionally call onAddUser to update the parent component
      onAddUser({
        id: contestUserId,
        contestId,
        gender: Gender.Male,
        isTemp: false,
        user: user,
      } as ContestUser);
    }
  };

  const handleRemoveContestUser = (user: ContestUser) => {
    setUserToRemove(user); // Set the user to be removed
    setIsDeleteDialogOpen(true); // Open the confirmation dialog
  };

  const confirmRemoveUser = async () => {
    if (userToRemove) {
      const success = await deleteUser(userToRemove);
      if (success) {
        onRemoveUser(userToRemove); // Call the onRemoveUser callback
      }
      setIsDeleteDialogOpen(false); // Close the confirmation dialog
      setUserToRemove(null); // Reset the user to remove
    }
  };

  const handleAddTempUser = async (name: string, gender: 'Male' | 'Female') => {
    // Implement the logic to add a temporary user
    // This could involve calling an API or updating state
  };

  const loadUsers = async () => {
    const fetchedUsers = await fetchUsers(); // Assuming filters are not needed for now
    setUsers(fetchedUsers);
  };

  return (
    <div>
      {/* Display the list of contest users */}
      <div className="flex flex-col w-full">
        {contestUsers.map(contestUser => (
          <ContestUserCard key={contestUser.id} contestUser={contestUser} onRemove={handleRemoveContestUser} />
        ))}
      </div>

      {/* Buttons on the same line */}
      <div className="flex space-x-2 mt-4 justify-center">
        <div className="flex-1">
          <Button className="w-full" onClick={() => { setUserPopinOpen(true); loadUsers(); }}>Add user in app</Button>
        </div>
        <div className="flex-1">
          <Button className="w-full" onClick={() => setTempUserPopinOpen(true)}>Add temp user</Button>
        </div>
      </div>

      {/* Popin for adding users from the app */}
      <Popin isOpen={isUserPopinOpen} onClose={() => setUserPopinOpen(false)} title="Add User">
        <div>
          {isLoadingUsers ? (
            <p>Loading users...</p>
          ) : (
            users.map((user: User) => (
              <UserCard
                key={user.id}
                name={user.name ?? 'Unknown User'} // Provide a default name if undefined
                profilePicture={user.image ?? '/default-profile.png'} // Provide a default profile picture if undefined
                isAdded={contestUsers.some(u => u.id === String(user.id))} // Ensure user.id is compared as a string
                isAddable={true}
                isRemovable={false}
                onClickAdd={() => {
                  const isUserAdded = contestUsers.some(u => u.id === String(user.id));
                  if (isUserAdded) {
                    handleRemoveContestUser(user); // Call the remove function
                  } else {
                    handleAddUserInApp(user); // Call the add function
                  }
                }} // Toggle add/remove functionality
              />
            ))
          )}
        </div>
      </Popin>

      {/* Popin for adding temporary users */}
      <Popin isOpen={isTempUserPopinOpen} onClose={() => setTempUserPopinOpen(false)} title="Add Temporary User">
        <form onSubmit={(e) => {
          e.preventDefault();
          const name = e.currentTarget.name.value;
          const gender = e.currentTarget.gender.value as 'Male' | 'Female';
          handleAddTempUser(name, gender);
          setTempUserPopinOpen(false);
        }}>
          <div>
            <label>Name:</label>
            <input type="text" name="name" required />
          </div>
          <div>
            <label>Gender:</label>
            <select name="gender" required>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <button type="submit">Add Temp User</button>
        </form>
      </Popin>

      {/* Confirmation Dialog for removing a user */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        title="Confirm user removal"
        text={`Are you sure you want to remove ${userToRemove?.name}?`}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmRemoveUser}
      />

    </div>
  );
};

export default UserTabContent; 