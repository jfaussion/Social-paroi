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
import AddButton from '../ui/AddButton';
import ContestTrackCard from '../contests/ContestTrackCard';
import ActivityCard from '../activities/ActivityCard';
import { useContestUserDetails } from '@/lib/contests/hooks/useContestUserDetails';
import { Contest } from '@/domain/Contest.schema';
import { useManageContestActivities } from '@/lib/contests/hooks/useManageContestActivities';

interface UserTabContentProps {
  contest: Contest;
  isOpener: boolean;
  onRemoveUser: (user: ContestUser) => void;
  onAddUser: (user: ContestUser) => void;
}

const UserTabContent: React.FC<UserTabContentProps> = ({ contest, isOpener, onRemoveUser, onAddUser }) => {
  const [isUserPopinOpen, setUserPopinOpen] = useState<boolean>(false);
  const [isTempUserPopinOpen, setTempUserPopinOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [userToRemove, setUserToRemove] = useState<ContestUser | null>(null);
  const { fetchUsers, isLoading: isLoadingUsers } = useFetchUsers();
  const { addUser, addTempUser, deleteUser } = useManageContestUsers();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedContestUser, setSelectedContestUser] = useState<ContestUser | null>(null);
  const [isGenderPopinOpen, setGenderPopinOpen] = useState<boolean>(false);
  const [isScorePopinOpen, setIsScorePopinOpen] = useState<boolean>(false);
  const { 
    tracks: userTracks, 
    activities: userActivities, 
    isLoading: isLoadingDetails,
    fetchDetails,
    setActivities 
  } = useContestUserDetails();
  const { updateActivityScore } = useManageContestActivities();


  const handleAddUserInApp = async (user: User, gender: GenderType) => {
    const contestUserId = await addUser(contest.id, user.id, gender);
    if (contestUserId) {
      onAddUser({
        id: contestUserId,
        contestId: contest.id,
        gender: gender,
        isTemp: false,
        user: user,
      } as ContestUser);
    }
  };

  const handleAddTempUser = async (name: string, gender: GenderType) => {
    const contestUserId = await addTempUser(contest.id, name, gender);
    if (contestUserId) {
      onAddUser({
        id: contestUserId,
        contestId: contest.id,
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

  const handleViewScoreAction = async (contestUser: ContestUser) => {
    setSelectedContestUser(contestUser);
    await fetchDetails(contest.id, contestUser.id);
    setIsScorePopinOpen(true);
  };

  return (
    <div>
      {/* Display the list of contest users */}
      <div className="flex flex-col w-full">
        {contest.users.map(contestUser => (
          <ContestUserCard
            key={contestUser.id}
            contestUser={contestUser}
            onRemove={handleRemoveContestUser}
            onViewScoreAction={handleViewScoreAction}
            isRemovable={isOpener}
            isOpener={isOpener}
          />
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
            users.map((user: User) => {
              const isUserAdded = contest.users.some(u => u.user?.id === user.id);

              return (
                <UserCard
                  key={user.id}
                  name={user.name ?? 'Unknown User'}
                  profilePicture={user.image ?? '/default-profile.png'}
                >
                  <AddButton 
                    isActive={isUserAdded}
                    isLoading={false}
                    onChange={() => {
                      const contestUserAdded = contest.users.find(u => u.user?.id === user.id);
                      if (contestUserAdded) {
                        handleRemoveContestUser(contestUserAdded);
                      } else {
                        setSelectedUser(user);
                        setGenderPopinOpen(true);
                      }
                    }}
                    style='small'
                  />
                </UserCard>
              );
            })
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

      {/* Score Recap Popin */}
      <Popin 
        isOpen={isScorePopinOpen} 
        onClose={() => setIsScorePopinOpen(false)} 
        title={`Score Recap - ${selectedContestUser?.user?.name ?? selectedContestUser?.name}`}
      >
        <div className="space-y-6 p-4">
          {isLoadingDetails ? (
            <div className="flex justify-center items-center py-8">
              <p>Loading details...</p>
            </div>
          ) : (
            <>
              {/* Tracks Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Completed Tracks</h3>
                <div className="space-y-4">
                  {userTracks.map(track => (
                    <ContestTrackCard
                      key={track.id}
                      {...track}
                      contest={contest}
                      contestUser={selectedContestUser ?? undefined}
                    />
                  ))}
                  {userTracks.length === 0 && (
                    <p className="text-gray-500">No tracks completed yet</p>
                  )}
                </div>
              </div>

              {/* Activities Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Activities</h3>
                <div className="space-y-4">
                  {userActivities.map(activity => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      contestUser={selectedContestUser ?? undefined}
                      displayImageAndDesc={false}
                      onScoreUpdate={async (activityId, newScore) => {
                        if (selectedContestUser) {
                          const success = await updateActivityScore(
                            contest.id,
                            activityId,
                            newScore,
                            selectedContestUser.id
                          );
                          if (success) {
                            // Update the activity score locally
                            setActivities(
                              userActivities.map(a => 
                                a.id === activityId 
                                  ? { ...a, userScore: newScore }
                                  : a
                              )
                            );
                          }
                        }
                      }}
                      displayToggleMenu={false}
                    />
                  ))}
                  {userActivities.length === 0 && (
                    <p className="text-gray-500">No activities available</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </Popin>

    </div>
  );
};

export default UserTabContent; 