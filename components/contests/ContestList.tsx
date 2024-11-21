'use client'
import { Contest } from "@/domain/Contest.schema";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { useSession } from "next-auth/react";
import { usePostContest } from "@/lib/contests/hooks/usePostContest";
import ConfirmationDialog from "../ui/ConfirmDialog";
import { useDeleteContest } from "@/lib/contests/hooks/useDeleteContest";
import ContestCard from "./ContestCard";
import { useFetchContests } from "@/lib/contests/hooks/useFetchContests";
import { ContestPlaceHolder } from "./ContestPlaceHolder";
import ContestForm from "./ContestForm";
import { isOpener } from "@/utils/session.utils";

function ContestList() {
  const { fetchContests, isLoading, error } = useFetchContests();
  const [contestList, setContestList] = useState<Contest[]>([]);
  const [hasLoadedDataOnce, setHasLoadedDataOnce] = useState<boolean>(false);
  const session = useSession();
  const [isPopinOpen, setIsPopinOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);

  const { isLoading: isPostLoading, error: errorPosting, postContestData } = usePostContest();
  const { isLoading: isLoadingDelete, error: errorDelete, deleteContest, reset: resetDeleteConfirmation } = useDeleteContest();

  const handleCreateContest = () => {
    setSelectedContest(null);
    setIsPopinOpen(true);
  }

  const handleEditContest = (contest: Contest) => {
    setSelectedContest(contest);
    setIsPopinOpen(true);
  }

  const handleDeleteContest = (contest: Contest) => {
    resetDeleteConfirmation();
    setSelectedContest(contest);
    setIsDeleteDialogOpen(true);
  }

  const deleteContestAndRefresh = async () => {
    const { success } = await deleteContest(selectedContest as Contest);
    if (success) {
      setIsDeleteDialogOpen(false);
      setContestList(contestList.filter(contest => contest.id !== selectedContest?.id));
    }
  }

  const postContest = async (contest: Contest, coverPhoto: File | null) => {
    const uploadedContest = await postContestData(contest, coverPhoto);
    if (uploadedContest) {
      setIsPopinOpen(false);
      updateContestList(uploadedContest);
    }
  }

  const updateContestList = (uploadedContest: Contest) => {
      const existingContestIndex = contestList.findIndex(contest => contest.id === uploadedContest.id);
      if (existingContestIndex > -1) {
        // Replace the existing contest
        const updatedList = [...contestList];
        updatedList[existingContestIndex] = uploadedContest;
        setContestList(updatedList);
      } else {
        // Add the new contest
        setContestList([...contestList, uploadedContest]);
      }
  }

  useEffect(() => {
    const fetch = async () => {
      const contests = await fetchContests();
      setHasLoadedDataOnce(true);
      setContestList(contests);
    };
    fetch();
  }, []);

  if (error && !isLoading) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!hasLoadedDataOnce || isLoading) {
    return (
      <div className="w-full space-y-4">
        <ContestPlaceHolder />
        <ContestPlaceHolder />
        <ContestPlaceHolder />
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-3xl flex flex-col items-center">
      {contestList.length === 0 && (
        <p>No contests available...</p>
      )}
      {contestList.map((contest: Contest) => (
        <ContestCard key={contest.id} contest={contest} editContest={handleEditContest} deleteContest={handleDeleteContest} />
      ))}
      {isOpener(session.data) && (
        <Button
          onClick={handleCreateContest}
          className="w-full sm:w-auto"
          btnStyle="secondary">
          Post Contest
        </Button>
      )}
      <ContestForm
        isOpen={isPopinOpen}
        onCancel={() => setIsPopinOpen(false)}
        onConfirm={postContest}
        contest={selectedContest}
        isLoading={isPostLoading}
        error={errorPosting ?? undefined} />
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        title='Delete Contest'
        text='Are you sure you want to delete this contest?'
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={deleteContestAndRefresh}
        error={errorDelete ?? undefined}
        isLoading={isLoadingDelete} />
    </div>
  );
};

export default ContestList;