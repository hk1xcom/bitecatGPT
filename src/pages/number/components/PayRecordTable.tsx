import React, { useState, useCallback } from 'react';
import {
  Card,
  Box,
  Flex,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useDisclosure
} from '@chakra-ui/react';
import { getPayOrders, checkPayResult } from '@/api/user';
import { PaySchema } from '@/types/mongoSchema';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { formatPrice } from '@/utils/user';
import WxConcat from '@/components/WxConcat';
import { useGlobalStore } from '@/store/global';
import { useToast } from '@/hooks/useToast';

const PayRecordTable = () => {
  const { isOpen: isOpenWx, onOpen: onOpenWx, onClose: onCloseWx } = useDisclosure();
  const [payOrders, setPayOrders] = useState<PaySchema[]>([]);
  const { setLoading } = useGlobalStore();
  const { toast } = useToast();

  const handleRefreshPayOrder = useCallback(
    async (payId: string) => {
      setLoading(true);

      try {
        const data = await checkPayResult(payId);
        toast({
          title: data,
          status: 'info'
        });
        const res = await getPayOrders();
        setPayOrders(res);
      } catch (error: any) {
        toast({
          title: error?.message,
          status: 'warning'
        });
        console.log(error);
      }

      setLoading(false);
    },
    [setLoading, toast]
  );

  useQuery(['initPayOrder'], getPayOrders, {
    onSuccess(res) {
      setPayOrders(res);
    }
  });
};

export default PayRecordTable;
