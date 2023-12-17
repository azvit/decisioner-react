import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../hook/redux";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {getExperts, sendInvitation} from "../store/actions/ExpertsAction";
import {TABLE_INIT} from "../constants";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { ExpertTableData } from "../models/models";
import { Button, CircularProgress, Table, TableCell, TableHead, TablePagination, TableRow } from "@mui/material";
import { setGroupExpertise } from "../store/actions/GroupExpertiseAction";

export function InvitationsPage() {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { experts, loading, error, count, completed, inviting } = useAppSelector(state => state.experts);
    const { user } = useAppSelector(state => state.auth);
    const {currentGroupExpertise} = useAppSelector(state => state.groupExpertise)
    const [expertList, setExpertList] = useState(experts ?? [])
    const [page, setPage] = useState(TABLE_INIT.SKIP);
    const [rowsPerPage, setRowsPerPage] = useState(TABLE_INIT.LIMIT);
    const [isInviting, setIsInviting] = useState<number|null>(null);

    const invite = (i: number) => {
        setIsInviting(i);
    }
    useEffect(() => {
        if (isInviting) {
            dispatch(sendInvitation({senderName: user!.name, expertiseId: currentGroupExpertise!._id, expertId: expertList[isInviting]._id}))
            let curExp = JSON.parse(JSON.stringify(currentGroupExpertise));
            curExp.invitedExperts.push(expertList[isInviting]._id);
            dispatch(setGroupExpertise(curExp));
        }
    }, [isInviting])
    useEffect(() => {
        if (!inviting) {
            setIsInviting(null);
        }
    }, [inviting])
    const checkInvited = (index:number) => {
        for (let i = 0; i < currentGroupExpertise!.experts.length; i++) {
            if (currentGroupExpertise!.experts[i]._id === expertList[index]._id) {
                return true
            }
        }
        for (let i = 0; i < currentGroupExpertise!.invitedExperts.length; i++) {
            if (currentGroupExpertise!.invitedExperts[i] === expertList[index]._id) {
                return true
            }
        }
        return false
    }
    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
      ) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };

    useEffect(() => {
        dispatch(getExperts(rowsPerPage, page, TABLE_INIT.SEARCH, TABLE_INIT.FILTER));
    }, [page, rowsPerPage]);

    useEffect(() => {
        setExpertList(experts);
    }, [experts]);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 330 },
        { field: 'email', headerName: 'Email', width: 230 },
        { field: 'phone', headerName: 'Phone', width: 230 },
        { field: 'degree', headerName: 'Degree', width: 130 },
        { field: 'academicStatus', headerName: 'Academic status', width: 130 },
        { field: 'direction', headerName: 'Direction', width: 130 },
        { field: 'activitySphere', headerName: 'Activity sphere', width: 130 }
      ];
      
    return (<div>
        <div style={{ height: 400, width: '100%' }}>
      <Table>
        <TableHead>
        <TableRow>
            <TableCell>
                Name
            </TableCell>
            <TableCell>
                Email
            </TableCell>
            <TableCell>
                Phone
            </TableCell>
            <TableCell>
                Degree
            </TableCell>
            <TableCell>
                Academic status
            </TableCell>
            <TableCell>
                Direction
            </TableCell>
            <TableCell>
                Activity sphere
            </TableCell>
            <TableCell>
                Invite
            </TableCell>
          </TableRow>
        </TableHead>
        {
            loading && <div>
                <CircularProgress/>
            </div>
        }
        {(!error && expertList) && expertList.map((expert, index) => <TableRow>
                <TableCell>
                    {expert.name}
                </TableCell>
                <TableCell>
                    {expert.email}
                </TableCell>
                <TableCell>
                    {expert.phone}
                </TableCell>
                <TableCell>
                    {expert.degree}
                </TableCell>
                <TableCell>
                    {expert.academicStatus}
                </TableCell>
                <TableCell>
                    {expert.direction}
                </TableCell>
                <TableCell>
                    {expert.activitySphere}
                </TableCell>
                <TableCell>
                    {(checkInvited(index) && (isInviting !== index)) && <Button disabled>
                            Invited
                        </Button>}
                        {(isInviting === index) && inviting && <Button disabled>
                            <p>Inviting <CircularProgress size={20}/></p>
                        </Button>}
                    {!checkInvited(index) && 
                        <Button onClick={() => invite(index)}>
                            Invite
                        </Button>
                    }
                    
                </TableCell>
            </TableRow>) 
        }
        
      </Table>
      <TablePagination
        component="div"
        rowsPerPageOptions={[1,2,3]}
        count={count}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
    </div>)
}
