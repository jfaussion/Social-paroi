import React, { useState } from 'react';
import { Button } from '../ui/Button';
import Popin from '../ui/Popin';
import { useFetchUsers } from '@/lib/users/hooks/useFetchUsers';
import { useManageContestUsers } from '@/lib/contests/hooks/useManageContestUsers';
import { ContestUser, GenderEnum, GenderType } from '@/domain/ContestUser.schema';
import UserCard from '../users/UserCard';
import ContestUserCard from '../users/ContestUserCard';
import { User } from '@/domain/User.schema';
import ConfirmationDialog from '../ui/ConfirmDialog';
import AddTempUserPopin from '../ui/AddTempUserPopin';

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [userToRemove, setUserToRemove] = useState<ContestUser | null>(null);
  const { fetchUsers, isLoading: isLoadingUsers } = useFetchUsers();
  const { addUser, addTempUser,deleteUser } = useManageContestUsers();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isGenderPopinOpen, setGenderPopinOpen] = useState<boolean>(false);

  const handleAddUserInApp = async (user: User, gender: GenderType) => {
    const contestUserId = await addUser(contestId, user.id, gender);
    if (contestUserId) {
      onAddUser({
        id: contestUserId,
        contestId,
        gender: gender,
        isTemp: false,
        user: user,
      } as ContestUser);
    }
  };

  const handleAddTempUser = async (name: string, gender: GenderType) => {
    const contestUserId = await addTempUser(contestId, name, gender);
    if (contestUserId) {
      onAddUser({
        id: contestUserId,
        contestId,
        gender: gender,
        isTemp: true,
        name: name,
      } as ContestUser);
    }
  };

  const handleRemoveContestUser = (user: ContestUser) => {
    setUserToRemove(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmRemoveUser = async () => {
    if (userToRemove) {
      const success = await deleteUser(userToRemove);
      if (success) {
        onRemoveUser(userToRemove);
      }
      setIsDeleteDialogOpen(false);
      setUserToRemove(null);
    }
  };

  const loadUsers = async () => {
    const fetchedUsers = await fetchUsers();
    setUsers(fetchedUsers);
  };

  const handleConfirmAddUser = (gender: GenderType) => {
    if (selectedUser) {
      handleAddUserInApp(selectedUser, gender);
      setGenderPopinOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <div>
      {/* Display the list of contest users */}
      <div className="flex flex-col w-full">
        {contestUsers.map(contestUser => (
          <ContestUserCard key={contestUser.id} contestUser={contestUser} onRemove={handleRemoveContestUser} isRemovable={isOpener}/>
        ))}
      </div>

      {/* Only show buttons if user is opener or admin */}
      {isOpener && (
        <div className="flex space-x-2 mt-4 justify-center">
          <div className="flex-1">
            <Button className="w-full" onClick={() => { setUserPopinOpen(true); loadUsers(); }}>Add user in app</Button>
          </div>
          <div className="flex-1">
            <Button className="w-full" onClick={() => setTempUserPopinOpen(true)}>Add temp user</Button>
          </div>
        </div>
      )}

      {/* Popin for adding users from the app */}
      <Popin isOpen={isUserPopinOpen} onClose={() => setUserPopinOpen(false)} title="Add User">
        <div>
          {isLoadingUsers ? (
            <p>Loading users...</p>
          ) : (
            users.map((user: User) => (
              <UserCard
                key={user.id}
                name={user.name ?? 'Unknown User'}
                profilePicture={user.image ?? '/default-profile.png'}
                isAdded={contestUsers.some(u => u.user?.id === user.id)}
                isAddable={true}
                isRemovable={false}
                onClickAdd={() => {
                  const contestUserAdded = contestUsers.find(u => u.user?.id === user.id);
                  if (contestUserAdded) {
                    handleRemoveContestUser(contestUserAdded);
                  } else {
                    setSelectedUser(user);
                    setGenderPopinOpen(true);
                  }
                }}
              />
            ))
          )}
        </div>
      </Popin>

      {/* Popin for adding temporary users */}
      <AddTempUserPopin
        isOpen={isTempUserPopinOpen}
        onClose={() => setTempUserPopinOpen(false)}
        addTempUser={handleAddTempUser}
      />

      {/* Popin for selecting gender */}
      <Popin isOpen={isGenderPopinOpen} onClose={() => setGenderPopinOpen(false)} title="Select Gender">
        <div>
          <p>Select gender (used for ranking) for {selectedUser?.name}:</p>
          <div className="mt-4 flex justify-end space-x-2">
            <Button onClick={() => handleConfirmAddUser(GenderEnum.Enum.Man)}>Man</Button>
            <Button onClick={() => handleConfirmAddUser(GenderEnum.Enum.Woman)}>Woman</Button>
          </div>
        </div>
      </Popin>

      {/* Confirmation Dialog for removing a user */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        title="Confirm user removal"
        text={`Are you sure you want to remove ${userToRemove?.user?.name ?? userToRemove?.name}?`}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmRemoveUser}
      />

    </div>
  );
};

export default UserTabContent; 